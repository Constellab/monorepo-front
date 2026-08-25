import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import {
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlFormFieldDirective,
  FlInputSearchFilter,
} from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInputSearchAdvancedButton, FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { FlTranslatableText, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiCredentials, LiCredentialsDatasource } from '@monorepo/lab-lib/li-core';
import { Observable } from 'rxjs';

import { LiCredentialsService } from '../../service/li-credentials.service';
import { LiCredentialsSearchFields } from '../../service/li-credentials-search.class';
import { LiCredentialsInlineComponent } from '../li-credentials-inline/li-credentials-inline.component';
import { LiSelectCredentialsDialogComponent } from '../li-select-credentials-dialog/li-select-credentials-dialog.component';

@Component({
  selector: 'li-select-credentials',
  templateUrl: './li-select-credentials.component.html',
  styleUrls: ['./li-select-credentials.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LiSelectCredentialsComponent }],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlInputSearchModule,
    FlUserModule,
    MatIcon,
    LiCredentialsInlineComponent,
    AsyncPipe,
    FlTranslateModule,
  ],
})
export class LiSelectCredentialsComponent
  extends FlFormFieldDirective<LiCredentials | null>
  implements OnInit
{
  private credentialsService = inject(LiCredentialsService);
  private dialogService = inject(FlDialogService);

  @Input() placeholder: FlTranslatableText = { text: 'li.select_credentials', translateText: true };

  @Input() type: string;

  @Output() credentialsChange: EventEmitter<LiCredentials | null> = new EventEmitter();

  selectedCredentials: LiCredentials | Observable<LiCredentials | null> | null;

  datasource: LiCredentialsDatasource<FlInputSearchFilter>;

  advancedButton: FlInputSearchAdvancedButton<LiCredentials>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, data) => {
        const searchFields: FlDatasourceGetPageData<LiCredentialsSearchFields> = {
          filtersCriteria: {
            name: data.filtersCriteria.searchText,
            type: this.type,
          },
          sortsCriteria: [{ key: 'name', direction: 'ASC' }],
        };
        return this.credentialsService.search(page, size, searchFields);
      },
      20,
      { initFirstPage: false }
    );

    this.advancedButton = {
      onClick: () => this.dialogService.openBigDialog(LiSelectCredentialsDialogComponent).afterClosed(),
    };
  }

  writeValue(obj: LiCredentials | null): void {
    // consider null value: null, not string, object without name
    if (obj == null || (typeof obj != 'string' && obj.name == null)) {
      this.selectedCredentials = null;
      this.value = null;
      return;
    }

    // if the provided object is not an instance of LiScenario, load it from the api
    if (typeof obj == 'string') {
      this.selectedCredentials = this.credentialsService.findByName(obj);
    } else if (!(obj instanceof LiCredentials)) {
      this.selectedCredentials = this.credentialsService.findByName((obj as any).name);
    } else {
      this.selectedCredentials = obj;
    }
    this.value = obj;
  }

  callChangeEvent(value: LiCredentials | null): void {
    this.credentialsChange.next(value);
    this.selectedCredentials = value;
  }

  onDisableChange(): void {}
}
