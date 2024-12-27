import { Component, Injector, OnInit, signal } from '@angular/core';
import {
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlInputSearchFilter,
  FlInputSearchModule,
  flSetRootInjector,
  FlTranslateModule,
  FlUser,
  FlUserModule,
} from '@monorepo/front-core-lib';
import { RenderData, Streamlit } from 'streamlit-component-lib';
import { AsyncPipe } from '@angular/common';
import { first, Subject } from 'rxjs';
import { ClPage, clRxjsDebug } from '@monorepo/core-lib';

interface DcResource {
  id: string;
  name: string;
  createdBy: FlUser;
}

export interface DcSelectResourceConfig {
  resources: ClPage<DcResource>;
}

function dcEmitStreamlitValue(selectedResource: DcResource, searchParam: string): void {
  Streamlit.setComponentValue({ selectedResource, searchParam });
}

// TODO this component is still in development
@Component({
  standalone: true,
  imports: [FlInputSearchModule, AsyncPipe, FlTranslateModule, FlUserModule],
  selector: 'dc-root',
  templateUrl: './dc-select-resource.component.html',
  styleUrl: './dc-select-resource.component.scss',
})
export class DcSelectResourceComponent implements OnInit {
  placeholder = signal<string>(null);

  selectedResource: DcResource;

  private subject = new Subject<ClPage<DcResource>>();

  datasource: FlEntityPaginatedDatasource<DcResource, FlInputSearchFilter> = new FlEntityPaginatedDatasource(
    (page: number, pageSize: number, data: FlDatasourceGetPageData<FlInputSearchFilter>) => {
      console.log('Search ', data.filtersCriteria?.searchText);
      dcEmitStreamlitValue(this.selectedResource, data.filtersCriteria?.searchText ?? null);
      // return the next emission of the subject
      return this.subject.pipe(first(), clRxjsDebug('Result'));
    },
    20,
    { initFirstPage: true }
  );

  constructor(injector: Injector) {
    flSetRootInjector(injector);
    console.log('DC Select Resource');
  }

  ngOnInit(): void {
    Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, (event: Event) => {
      const customEvent: CustomEvent<RenderData<DcSelectResourceConfig>> = event as CustomEvent<RenderData>;
      const data = customEvent.detail.args;
      console.log(data);
      this.subject.pipe(first(), clRxjsDebug('Result 2'));
      if (data.resources) {
        this.subject.next(data.resources);
      }
      Streamlit.setFrameHeight();
    });

    Streamlit.setComponentReady();
    Streamlit.setFrameHeight();

    this.datasource.connect().pipe(clRxjsDebug()).subscribe();
    // this.subject.pipe(clRxjsDebug()).subscribe();
  }

  setAndEmitResource(resource: DcResource): void {
    this.selectedResource = resource;
    dcEmitStreamlitValue(this.selectedResource, '');
  }
}
