import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { DcComponentLoaderService } from '../../service/dc-component-loader.service';
import { DcComponentData, DcDynamicComponentEnum } from '../../../../core/model/dc-dynamic-component.class';
import { DcStreamlitEvent } from '../dc-component-loader-iframe-dev/dc-component-loader-iframe-dev.component';
import {
  DcSelectResourceInput,
} from '../../../dc-components/dc-select-resource/dc-select-resource.component';
import { DcMenuConfig } from '../../../dc-components/dc-menu/dc-menu.component';

/**
 * Component to use in development mode to work on components without the streamlit server
 * Those component run in standalone mode and are not in the iframe.
 */
@Component({
  selector: 'dc-root',
  imports: [],
  templateUrl: './dc-component-loader-dev.component.html',
  styleUrl: './dc-component-loader-dev.component.scss',
  providers: [DcComponentLoaderService],
})
export class DcComponentLoaderDevComponent implements OnInit {
  private componentLoaderService = inject(DcComponentLoaderService);

  @ViewChild('selectResource', { static: true }) selectResourceContainer: ElementRef<HTMLElement>;
  @ViewChild('menu', { static: true }) menuContainer: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.initSelectResource();
    this.initMenu();
  }

  private initSelectResource(): void {
    this.loadComponent(
      {
        // no need in dev mode
        authentication_info: null,
        container_class: null,

        // change following to dev on a specific component
        component: DcDynamicComponentEnum.SELECT_RESOURCE,
        component_data: {
          placeholder: 'Select a resource',
          default_filters: {
            tags: [{ key: 'raw_data' }, { key: 'origin', value: 'biolector_dashboard' }],
          },
          column_tags_filter_keys: ['well'],
        } as DcSelectResourceInput,
      },
      this.selectResourceContainer.nativeElement
    ).then();
  }

  private initMenu(): void {
    this.loadComponent(
      {
        // no need in dev mode
        authentication_info: null,
        container_class: null,

        // change following to dev on a specific component
        component: DcDynamicComponentEnum.MENU_BUTTON,
        component_data: {
          icon: 'more_vert',
          menu_items: [{ label: 'Item 1', material_icon: 'check' }],
        } as DcMenuConfig,
      },
      this.menuContainer.nativeElement
    ).then();
  }

  private async loadComponent(data: DcComponentData, element: HTMLElement): Promise<void> {
    const streamlitEvent = new DcStreamlitEvent();
    // create the component
    // don't listen to element removal because we are in the iframe
    // so we don't have access to the main app and when the iframe is removed
    // the component is removed too
    await this.componentLoaderService.createComponent(data, element, streamlitEvent, false);
  }
}
