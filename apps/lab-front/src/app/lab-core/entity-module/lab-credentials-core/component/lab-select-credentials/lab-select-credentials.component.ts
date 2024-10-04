import { Component, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';
import {
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlFormFieldDirective,
  FlInputSearchFilter,
  FlTranslatableText
} from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { NgControl } from '@angular/forms';
import {
  LabCredentials,
  LabCredentialsDatasource,
  LabCredentialsType
} from '../../../../model/entities/lab-credentials.entity';
import { LabCredentialsService } from '../../../../entity-service/lab-credentials.service';
import { LabCredentialsSearchFields } from '../lab-select-credentials-dynamic-field/lab-credentials-search.class';

@Component({
  selector: 'lab-select-credentials',
  templateUrl: './lab-select-credentials.component.html',
  styleUrls: ['./lab-select-credentials.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LabSelectCredentialsComponent }]
})
export class LabSelectCredentialsComponent extends FlFormFieldDirective<LabCredentials>
  implements OnInit {

  @Input() placeholder: FlTranslatableText = { text: 'biox.select_credentials', translateText: true };

  @Input() type: LabCredentialsType;

  @Output() credentialsChange: EventEmitter<LabCredentials> = new EventEmitter();

  selectedCredentials: LabCredentials | Observable<LabCredentials>;

  datasource: LabCredentialsDatasource<FlInputSearchFilter>;

  constructor(@Optional() @Self() ngControl: NgControl,
              private credentialsService: LabCredentialsService) {
    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, data) => {
        const searchFields: FlDatasourceGetPageData<LabCredentialsSearchFields> = {
          filtersCriteria: {
            name: data.filtersCriteria.searchText,
            type: this.type
          },
          sortsCriteria: [{ key: 'name', direction: 'ASC' }]
        };
        return this.credentialsService.search(page, size, searchFields);
      }, 20, false);
  }

  writeValue(obj: LabCredentials): void {
    // consider null value: null, not string, object without name
    if (obj == null || (typeof obj != 'string' && obj.name == null)) {
      this.selectedCredentials = null;
      this.value = null;
      return;
    }

    // if the provided object is not an instance of LabScenario, load it from the api
    if (typeof obj == 'string') {
      this.selectedCredentials = this.credentialsService.findByName(obj);
    } else if (!(obj instanceof LabCredentials)) {
      this.selectedCredentials = this.credentialsService.findByName((obj as any).name);
    } else {
      this.selectedCredentials = obj;
    }
    this.value = obj;
  }

  callChangeEvent(value: LabCredentials): void {
    this.credentialsChange.next(value);
    this.selectedCredentials = value;
  }

  onDisableChange(): void {
  }


}

