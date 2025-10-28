import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { TeBlockType, TeRichTextDTO } from '@monorepo/text-editor';

import {
  DcComponentData,
  DcDynamicComponentEnum,
  DcDynamicComponentEvent,
} from '../../../../core/model/dc-dynamic-component.class';
import { DcMenuComponent, DcMenuConfig } from '../../../dc-components/dc-menu/dc-menu.component';
import {
  DcSelectResourceComponent,
  DcSelectResourceInput,
} from '../../../dc-components/dc-select-resource/dc-select-resource.component';
import {
  DcRichTextConfig,
  DcTextEditorComponent,
} from '../../../dc-components/dc-text-editor/dc-text-editor.component';
import {
  DcTreeConfig,
  DcTreeMenuComponent,
} from '../../../dc-components/dc-tree-menu/dc-tree-menu.component';
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
  imports: [DcSelectResourceComponent, DcMenuComponent, DcTreeMenuComponent, DcTextEditorComponent],
  templateUrl: './dc-component-loader-dev.component.html',
  styleUrl: './dc-component-loader-dev.component.scss',
  providers: [DcComponentLoaderService],
})
export class DcComponentLoaderDevComponent implements OnInit {
  private componentLoaderService = inject(DcComponentLoaderService);

  @ViewChild('selectResourceDynamic', { static: true }) selectResourceContainer: ElementRef<HTMLElement>;

  // Direct component inputs - used in template with property binding
  selectResourceConfig = signal<DcSelectResourceInput>({
    placeholder: 'Select a resource',
    default_filters: {
      tags: [{ key: 'raw_data' }, { key: 'origin', value: 'biolector_dashboard' }],
    },
    column_tags_filter_keys: ['well'],
  });

  menuConfig = signal<DcMenuConfig>({
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
  });

  treeConfig = signal<DcTreeConfig>({
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
  });

  textEditorConfig = signal<DcRichTextConfig>({
    placeholder: 'Enter your text here...',
    initialValue: {
      version: 2,
      editorVersion: '2.30.2',
      blocks: [
        {
          id: 'sample-block-1',
          type: TeBlockType.PARAGRAPH,
          data: {
            text: 'This is a sample text editor with some initial content.',
          },
        },
      ],
    },
    disabled: false,
    minHeight: '200px',
    maxHeight: '500px',
  });

  ngOnInit(): void {
    // Keep one example of dynamic loading
    this.initSelectResourceDynamic();
  }

  onTextEditorOutput(data: TeRichTextDTO): void {
    console.log('Text editor output:', data);
  }

  onMenuOutput(data: any): void {
    console.log('Menu output:', data);
  }

  onTreeOutput(data: any): void {
    console.log('Tree output:', data);
  }

  onSelectResourceOutput(data: any): void {
    console.log('Select resource output:', data);
  }

  updateTextEditorValue(): void {
    this.textEditorConfig.set({
      placeholder: 'Enter your text here...',
      initialValue: {
        version: 2,
        editorVersion: '2.30.2',
        blocks: [
          {
            id: 'sample-block-1',
            type: TeBlockType.PARAGRAPH,
            data: {
              text: 'This is the UPDATED text editor content with new value!',
            },
          },
          {
            id: 'sample-block-2',
            type: TeBlockType.PARAGRAPH,
            data: {
              text: 'This is a second paragraph added after update.',
            },
          },
        ],
      },
      disabled: false,
      minHeight: '200px',
      maxHeight: '500px',
    });
  }

  private initSelectResourceDynamic(): void {
    const config: DcSelectResourceInput = {
      placeholder: 'Select a resource (dynamic)',
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
