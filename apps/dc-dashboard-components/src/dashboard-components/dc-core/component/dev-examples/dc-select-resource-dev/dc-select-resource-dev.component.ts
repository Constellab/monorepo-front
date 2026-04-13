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
  @ViewChild('selectResourceReflex', { static: true }) selectResourceReflexContainer: ElementRef<HTMLElement>;

  selectResourceConfig = signal<DcSelectResourceInput>({
    placeholder: 'Select a resource',
    default_filters: {},
  });

  ngOnInit(): void {
    this.initSelectResourceDynamic();
    this.initSelectResourceReflex();
  }

  onSelectResourceOutput(data: any): void {
    console.log('Select resource output:', data);
  }

  private initSelectResourceDynamic(): void {
    const config: DcSelectResourceInput = {
      placeholder: 'Select a resource (dynamic)',
      default_filters: {},
    };

    this.loadComponent(
      config,
      DcDynamicComponentEnum.SELECT_RESOURCE,
      this.selectResourceContainer.nativeElement
    );
  }

  /**
   * Simulates how the Reflex app uses the component as a raw custom element:
   * creates the element via DOM API, sets inputs as JSON string properties,
   * and listens for outputEvent via addEventListener.
   */
  private initSelectResourceReflex(): void {
    const container = this.selectResourceReflexContainer.nativeElement;

    const element = document.createElement('custom-select-resource');
    element.style.display = 'flex';
    element.style.flexDirection = 'column';
    element.style.width = '100%';

    const inputData: DcSelectResourceInput = {
      placeholder: 'Select a resource (reflex)',
      default_filters: {},
    };

    (element as any).inputData = JSON.stringify({ ...inputData, __count__: 1 });

    element.addEventListener('outputEvent', (event: CustomEvent) => {
      console.log('Reflex select resource output:', event.detail);
    });

    container.appendChild(element);
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
