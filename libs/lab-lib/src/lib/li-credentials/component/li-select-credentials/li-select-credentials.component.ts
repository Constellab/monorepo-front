import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import {
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlFormFieldDirective,
  FlInputSearchFilter,
} from '@monorepo/front-core-lib/fl-core';
import { FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { FlTranslatableText, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiCredentials, LiCredentialsDatasource, LiCredentialsType } from '@monorepo/lab-lib/li-core';
import { LiCredentialsInlineComponent } from '../li-credentials-inline/li-credentials-inline.component';
import { LiCredentialsSearchFields } from '../../service/li-credentials-search.class';
import { LiCredentialsService } from '../../service/li-credentials.service';
import { MatIcon } from '@angular/material/icon';
import { NgControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'li-select-credentials',
  templateUrl: './li-select-credentials.component.html',
  styleUrls: ['./li-select-credentials.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LiSelectCredentialsComponent }],
  imports: [
    FlInputSearchModule,
    FlUserModule,
    MatIcon,
    LiCredentialsInlineComponent,
    AsyncPipe,
    FlTranslateModule,
  ],
})
export class LiSelectCredentialsComponent extends FlFormFieldDirective<LiCredentials> implements OnInit {
  private credentialsService = inject(LiCredentialsService);

  @Input() placeholder: FlTranslatableText = { text: 'biox.select_credentials', translateText: true };

  @Input() type: LiCredentialsType;

  @Output() credentialsChange: EventEmitter<LiCredentials> = new EventEmitter();

  selectedCredentials: LiCredentials | Observable<LiCredentials>;

  datasource: LiCredentialsDatasource<FlInputSearchFilter>;

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
  }

  writeValue(obj: LiCredentials): void {
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

  callChangeEvent(value: LiCredentials): void {
    this.credentialsChange.next(value);
    this.selectedCredentials = value;
  }

  onDisableChange(): void {}
}
