import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';

import {
  DcComponentData,
  DcDynamicComponentEnum,
  DcDynamicComponentEvent,
} from '../../../../../core/model/dc-dynamic-component.class';
import {
  DcSelectResourceComponent,
  DcSelectResourceInput,
} from '../../../../dc-components/dc-select-resource/dc-select-resource.component';
import { DcComponentLoaderService } from '../../../service/dc-component-loader.service';

class DcStreamlitEventLogger implements DcDynamicComponentEvent {
  setComponentValue(jsonData: any): void {
    console.log('Component value set:', jsonData);
  }
}

@Component({
  selector: 'dc-select-resource-dev',
  imports: [DcSelectResourceComponent],
  templateUrl: './dc-select-resource-dev.component.html',
  styleUrl: '../dc-dev-examples.scss',
  providers: [DcComponentLoaderService],
})
export class DcSelectResourceDevComponent implements OnInit {
  private componentLoaderService = inject(DcComponentLoaderService);

  @ViewChild('selectResourceDynamic', { static: true }) selectResourceContainer: ElementRef<HTMLElement>;

  selectResourceConfig = signal<DcSelectResourceInput>({
    placeholder: 'Select a resource',
    default_filters: {
      tags: [{ key: 'raw_data' }, { key: 'origin', value: 'biolector_dashboard' }],
      columnTags: [{ key: 'well' }],
    },
  });

  ngOnInit(): void {
    this.initSelectResourceDynamic();
  }

  onSelectResourceOutput(data: any): void {
    console.log('Select resource output:', data);
  }

  private initSelectResourceDynamic(): void {
    const config: DcSelectResourceInput = {
      placeholder: 'Select a resource (dynamic)',
      default_filters: {
        tags: [{ key: 'raw_data' }, { key: 'origin', value: 'biolector_dashboard' }],
        columnTags: [{ key: 'well' }],
      },
    };

    this.loadComponent(
      config,
      DcDynamicComponentEnum.SELECT_RESOURCE,
      this.selectResourceContainer.nativeElement
    );
  }

  private loadComponent(
    componentConfig: any,
    componentType: DcDynamicComponentEnum,
    element: HTMLElement
  ): void {
    const streamlitEvent = new DcStreamlitEventLogger();

    const componentData: DcComponentData = {
      authentication_info: componentConfig.authentication_info,
      container_class: componentConfig.container_class,
      component: componentType,
      component_data: componentConfig,
      timestamp: new Date().getTime(),
    };
    this.componentLoaderService.createOrUpdateComponent(componentData, element, streamlitEvent).then();
  }
}
