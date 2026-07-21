import { ChangeDetectionStrategy,Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { LiLab, LiLabDatasource } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiLabService } from '../../service/li-lab.service';
import { LiLabSearch, LiLabSearchFields } from '../../service/li-lab-search.class';
import { LiLabRegistrationDialogComponent } from '../li-lab-registration-dialog/li-lab-registration-dialog.component';
import { LiLabSearchFormComponent } from '../li-lab-search-form/li-lab-search-form.component';
import { LiLabTableComponent } from '../li-lab-table/li-lab-table.component';

@Component({
  selector: 'li-lab-search',
  templateUrl: './li-lab-search.component.html',
  styleUrls: ['./li-lab-search.component.scss'],
  providers: [FlSearchState],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlSearchModule,
    LiLabSearchFormComponent,
    FlTextIconModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    LiLabTableComponent,
    TranslatePipe,
    FlIconModule,
  ],
})
export class LiLabSearchComponent implements OnInit {
  @Input() labSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  @Output() labSelected: EventEmitter<LiLab> = new EventEmitter();

  columns: FlTableColumnStatic<LiLab>[] = [
    'name',
    'spaceName',
    'environment',
    'domain',
    'hasCredentials',
    'actions',
  ];

  datasource: LiLabDatasource<LiLabSearchFields>;

  private searchState = inject(FlSearchState);
  private labService = inject(LiLabService);
  private dialogService = inject(FlDialogService);
  private themeService = inject(FlThemeService);

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LiLabSearch.getSearchForm as any,
      advancedFormClass: LiLabSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LiLabSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: this.fullPageSearch,
      defaultSort: { key: 'name', direction: 'ASC' },
    };

    this.datasource = this.labService.searchDatasource();
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'li-lab',
        id: 'all-labs',
        label: 'All labs',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {},
      },
    ];
  }

  openRegistrationDialog(): void {
    this.dialogService
      .openMediumDialog(LiLabRegistrationDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.datasource.addItem(result, () => true);
        }
      });
  }

  selectLab(lab: LiLab): void {
    this.labSelected.next(lab);
  }
}
