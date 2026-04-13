import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClCoreJsonConvert } from '@monorepo/core-lib';
import { FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import {
  LiResource,
  LiResourceSearchFields,
  LiResourceSearchFieldsDisabled,
} from '@monorepo/lab-lib/li-core';
import { LiSelectResourceComponent } from '@monorepo/lab-lib/li-resource';

import {
  DcAuthenticationInfo,
  DcDynamicComponent,
  dcParseJsonInput,
} from '../../../core/model/dc-dynamic-component.class';
import { DcCoreMainDirective } from '../../dc-core/directive/dc-core-main-prod/dc-core-main.directive';

export interface DcSelectResourceInput {
  placeholder: string;
  default_resource?: any;
  default_filters?: Partial<LiResourceSearchFields>;
  disabled_filters?: Partial<LiResourceSearchFieldsDisabled>;
}

export interface DcSelectResourceOutput {
  resourceId: string | null;
}

@Component({
  standalone: true,
  imports: [FlInputSearchModule, FlUserModule, FormsModule, LiSelectResourceComponent],
  selector: 'dc-select-resource',
  templateUrl: './dc-select-resource.component.html',
  styleUrl: './dc-select-resource.component.scss',
  hostDirectives: [DcCoreMainDirective],
})
export class DcSelectResourceComponent
implements OnInit, DcDynamicComponent<DcSelectResourceInput, DcSelectResourceOutput>
{
  inputData = input<DcSelectResourceInput, any>(null, {
    transform: dcParseJsonInput,
  });
  authenticationInfo = input<DcAuthenticationInfo, any>(null, {
    transform: dcParseJsonInput,
  });
  outputEvent = output<DcSelectResourceOutput>();

  private mainDirective = inject(DcCoreMainDirective);

  isInitialized = computed(() => {
    const data = this.inputData();
    console.log('Input data for select resource:', data);
    return !!data;
  });

  resource = computed(() => {
    const data = this.inputData();
    if (!data?.default_resource) return null;
    return ClCoreJsonConvert.deserializeObject(data.default_resource, LiResource);
  });

  placeholder = computed<any>(() => {
    const data = this.inputData();
    if (!data) return null;
    return { text: data.placeholder, translateText: false };
  });

  defaultFilters = computed(() => {
    const data = this.inputData();
    if (!data?.default_filters) return null;
    return ClCoreJsonConvert.deserializeObject(data.default_filters, LiResourceSearchFields);
  });

  disabledFilters = computed(() => {
    const data = this.inputData();
    if (!data?.disabled_filters) return null;
    return data.disabled_filters;
  });

  ngOnInit(): void {
    this.mainDirective.init(this.authenticationInfo());
  }

  setAndEmitResource(resource: LiResource): void {
    if (resource) {
      this.outputEvent.emit({ resourceId: resource.id });
    } else {
      this.outputEvent.emit({ resourceId: null });
    }
  }
}
