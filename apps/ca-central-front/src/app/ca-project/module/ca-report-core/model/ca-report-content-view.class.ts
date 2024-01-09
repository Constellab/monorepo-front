import {CaReportContentViewComponent} from '../component/ca-report-content-view/ca-report-content-view.component';
import {RvConfigValues, RvResourceView} from '@monorepo/resource-view';
import {FlQuillEmbed} from '@monorepo/front-core-lib';
import {TeComponentBlock} from '@monorepo/text-editor';
import {BlockToolConstructorOptions} from '@editorjs/editorjs/types/tools/block-tool';
import {ApplicationRef, EnvironmentInjector, Type} from '@angular/core';
import {BlockToolData} from '@editorjs/editorjs/types/tools/block-tool-data';
import {CaReportService} from '../../../../ca-core/service-api/ca-report.service';
import {map} from 'rxjs/operators';


export interface CaReportViewConfig {
  filename: string;
  id: string;
  resource_id: string;
  view_method_name: string;
  view_config: RvConfigValues;
  title: string;
  caption: string;
}

export class CaReportContentViewBlot extends FlQuillEmbed {

  static blotName = 'resource_view' as const;
  static tagName = 'ca-report-content-view';
  static className = 'g-quill-block';

  private readonly storedValue: RvResourceView;

  static create(value: CaReportViewConfig): any {
    const node: HTMLElement = super.create(value) as any;

    // pass data to the component via the node
    const component: CaReportContentViewComponent = node as any;
    component.viewConfig = value;

    return node;
  }

  constructor(node: Node, value: any) {
    super(node);
    this.storedValue = value;
  }

  value(): { resource_view: RvResourceView } {

    return {[CaReportContentViewBlot.blotName]: this.storedValue};
  }
}

export class CaReportContentViewBlock extends TeComponentBlock<CaReportContentViewComponent> {

  constructor(protected options: BlockToolConstructorOptions,
              protected readonly envInjector: EnvironmentInjector,
              protected readonly applicationRef: ApplicationRef,
              // additionalData is the report id
              protected readonly additionalData: string) {
    super(options, envInjector, applicationRef, additionalData);
  }

  public static readonly TAG_NAME = 'ca-report-content-view';


  getComponentType(): Type<CaReportContentViewComponent> {
    return CaReportContentViewComponent;
  }

  getTagName(): string {
    return CaReportContentViewBlock.TAG_NAME;
  }

  initInputs(data: CaReportViewConfig): void {
    this.componentInstance.viewConfig = data;

    // load the view
    const reportService = this.envInjector.get(CaReportService);
    this.componentInstance.view$ = reportService.getView(this.additionalData, data.filename).pipe(
      map(reportView => reportView.view)
    );
  }

  // this is only for read only mode
  save(): BlockToolData {
    return this.data;
  }
}


