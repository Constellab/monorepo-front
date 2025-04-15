import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { DcComponentLoaderService } from '../../service/dc-component-loader.service';
import { DcComponentData, DcDynamicComponentEnum } from '../../../../core/model/dc-dynamic-component.class';
import { DcStreamlitEvent } from '../dc-component-loader-iframe-dev/dc-component-loader-iframe-dev.component';
import { DcSelectResourceInput } from '../../../dc-components/dc-select-resource/dc-select-resource.component';

@Component({
  selector: 'dc-root',
  imports: [],
  templateUrl: './dc-component-loader-dev.component.html',
  styleUrl: './dc-component-loader-dev.component.scss',
  providers: [DcComponentLoaderService],
})
export class DcComponentLoaderDevComponent implements OnInit {
  private componentLoaderService = inject(DcComponentLoaderService);

  @ViewChild('div', { static: true }) div: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.init({
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
    }).then();
  }

  private async init(data: DcComponentData): Promise<void> {
    const streamlitEvent = new DcStreamlitEvent();
    // create the component
    // don't listen to element removal because we are in the iframe
    // so we don't have access to the main app and when the iframe is removed
    // the component is removed too
    await this.componentLoaderService.createComponent(data, this.div.nativeElement, streamlitEvent, false);
  }
}
