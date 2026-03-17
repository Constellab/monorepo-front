import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
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
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { LiCredentials, LiCredentialsDatasource } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiCredentialsService } from '../../service/li-credentials.service';
import { LiCredentialsSearch, LiCredentialsSearchFields } from '../../service/li-credentials-search.class';
import {
  LiCredentialsFormDialogComponent,
  LiCredentialsFormDialogInput,
} from '../li-credentials-form-dialog/li-credentials-form-dialog.component';
import { LiCredentialsSearchFormComponent } from '../li-credentials-search-form/li-credentials-search-form.component';
import { LiCredentialsTableComponent } from '../li-credentials-table/li-credentials-table.component';

@Component({
  selector: 'li-credentials-search',
  templateUrl: './li-credentials-search.component.html',
  styleUrls: ['./li-credentials-search.component.scss'],
  providers: [FlSearchState],
  imports: [
    FlSearchModule,
    LiCredentialsSearchFormComponent,
    FlTextIconModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    LiCredentialsTableComponent,
    TranslatePipe,
  ],
})
export class LiCredentialsSearchComponent implements OnInit {
  @Input() credentialsSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  @Output() credentialsSelected: EventEmitter<LiCredentials> = new EventEmitter();

  columns: FlTableColumnStatic<LiCredentials>[] = ['name', 'description', 'type', 'created', 'actions'];

  datasource: LiCredentialsDatasource<LiCredentialsSearchFields>;

  private searchState = inject(FlSearchState);
  private credentialsService = inject(LiCredentialsService);
  private dialogService = inject(FlDialogService);
  private themeService = inject(FlThemeService);

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LiCredentialsSearch.getSearchForm as any,
      advancedFormClass: LiCredentialsSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LiCredentialsSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: this.fullPageSearch,
      defaultSort: { key: 'name', direction: 'ASC' },
    };

    this.datasource = this.credentialsService.searchDatasource();
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'li-credentials',
        id: 'all-credentials',
        label: 'All credentials',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {},
      },
    ];
  }

  createCredentials(): void {
    const data: LiCredentialsFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openMediumDialog(LiCredentialsFormDialogComponent, {
        data: data,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.datasource.addItem(result, () => true);
        }
      });
  }

  selectCredentials(credentials: LiCredentials): void {
    this.credentialsSelected.next(credentials);
  }
}
