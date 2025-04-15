import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { FlTranslatableText, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiResource, LiResourceSearchFields } from '@monorepo/lab-lib/li-core';
import { FormsModule } from '@angular/forms';
import { DcComponentData, DcDynamicComponent } from '../../../core/model/dc-dynamic-component.class';
import { ClCoreJsonConvert } from '@monorepo/core-lib';
import { DcCoreMainDirective } from '../../dc-core/directive/dc-core-main-prod/dc-core-main.directive';
import { LiSelectResourceComponent } from '@monorepo/lab-lib/li-resource';

export interface DcSelectResourceInput {
  placeholder: string;
  default_resource?: any;
  default_filters?: LiResourceSearchFields;
  column_tags_filter_keys?: string[];
}

export interface DcSelectResourceOutput {
  resourceId: string | null;
}

@Component({
  standalone: true,
  imports: [FlInputSearchModule, FlTranslateModule, FlUserModule, FormsModule, LiSelectResourceComponent],
  selector: 'dc-select-resource',
  templateUrl: './dc-select-resource.component.html',
  styleUrl: './dc-select-resource.component.scss',
  hostDirectives: [DcCoreMainDirective],
})
export class DcSelectResourceComponent
  implements OnInit, DcDynamicComponent<DcSelectResourceInput, DcSelectResourceOutput>, OnDestroy
{
  @Input() inputData: DcComponentData<DcSelectResourceInput>;
  @Output() outputEvent = new EventEmitter<DcSelectResourceOutput>();

  private mainDirective = inject(DcCoreMainDirective);

  resource: LiResource;
  placeholder: FlTranslatableText;
  defaultFilters: LiResourceSearchFields;
  columnTagsFilterKeys: string[];

  ngOnInit(): void {
    this.mainDirective.init(this.inputData);
    if (this.inputData.component_data.default_resource) {
      this.resource = ClCoreJsonConvert.deserializeObject(
        this.inputData.component_data.default_resource,
        LiResource
      );
    }
    if (this.inputData.component_data.default_filters) {
      this.defaultFilters = ClCoreJsonConvert.deserializeObject(
        this.inputData.component_data.default_filters,
        LiResourceSearchFields
      );
    }
    if (this.inputData.component_data.column_tags_filter_keys) {
      this.columnTagsFilterKeys = this.inputData.component_data.column_tags_filter_keys;
    }
    this.placeholder = { text: this.inputData.component_data.placeholder, translateText: false };
  }

  setAndEmitResource(resource: LiResource): void {
    if (resource) {
      this.outputEvent.emit({ resourceId: resource.id });
    } else {
      this.outputEvent.emit({ resourceId: null });
    }
  }

  ngOnDestroy(): void {
    console.log('Detroooooooy');
  }
}
