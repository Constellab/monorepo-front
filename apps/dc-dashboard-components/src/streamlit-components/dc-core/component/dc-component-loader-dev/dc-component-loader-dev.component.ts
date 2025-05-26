import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import {
  DcComponentData,
  DcDynamicComponentEnum,
  DcDynamicComponentEvent,
} from '../../../../core/model/dc-dynamic-component.class';
import { DcMenuConfig } from '../../../dc-components/dc-menu/dc-menu.component';
import { DcSelectResourceInput } from '../../../dc-components/dc-select-resource/dc-select-resource.component';
import { DcTreeConfig } from '../../../dc-components/dc-tree-menu/dc-tree-menu.component';
import { DcComponentLoaderService } from '../../service/dc-component-loader.service';

/**
 * Class to transfer the dynamic component output to the streamlit component
 */
export class DcStreamlitEventLogger implements DcDynamicComponentEvent {
  setComponentValue(jsonData: any): void {
    // Log the event to the console
    console.log('Component value set:', jsonData);
  }
}

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
  @ViewChild('tree', { static: true }) treeContainer: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.initSelectResource();
    this.initMenu();
    this.initTree();
  }

  private initSelectResource(): void {
    const config: DcSelectResourceInput = {
      placeholder: 'Select a resource',
      default_filters: {
        tags: [{ key: 'raw_data' }, { key: 'origin', value: 'biolector_dashboard' }],
      },
      column_tags_filter_keys: ['well'],
    };

    this.loadComponent(
      config,
      DcDynamicComponentEnum.SELECT_RESOURCE,
      this.selectResourceContainer.nativeElement
    );
  }

  private initMenu(): void {
    const menuConfig: DcMenuConfig = {
      icon: 'more_vert',
      menu_items: [
        {
          key: 'item1',
          label: 'Item 1',
          material_icon: 'check',
          has_handler: true,
          children: [{ key: 'subitem1', label: 'Subitem 1', material_icon: 'check', has_handler: true }],
        },
        { key: 'item2', label: 'Item 2', material_icon: 'close', has_handler: false },
      ],
    };
    this.loadComponent(menuConfig, DcDynamicComponentEnum.MENU_BUTTON, this.menuContainer.nativeElement);
  }

  private initTree(): void {
    const treeConfig: DcTreeConfig = {
      tree_items: [
        {
          id: 'root',
          label: 'Root',
          material_icon: 'folder',
          children: [
            {
              id: 'child1',
              label: 'Child 1',
              material_icon: 'folder',
              children: [
                { id: 'grandchild1', label: 'Grandchild 1', material_icon: 'description' },
                {
                  id: 'grandchild2',
                  label: 'Grandchild 2',
                  material_icon: 'description',
                },
              ],
            },
            { id: 'child2', label: 'Disabled child 2', material_icon: 'description', disabled: true },
          ],
        },
      ],
    };

    this.loadComponent(treeConfig, DcDynamicComponentEnum.TREE_MENU, this.treeContainer.nativeElement);
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
    // create the component
    // don't listen to element removal because there is not iframe in dev mode
    this.componentLoaderService.createOrUpdateComponent(componentData, element, streamlitEvent).then();
  }
}
