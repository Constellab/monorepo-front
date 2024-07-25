import { Component, Input } from '@angular/core';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import { LabResourceViewData } from '../../../../model/entities/resource/lab-resource-view.entity';
import { Observable } from 'rxjs';
import { RvViewConfig } from '@monorepo/resource-view';
import { TeElementBlockDirective } from '@monorepo/text-editor';
import { LabResourceENoteService } from '../../../../entity-service/lab-resource-enote.service';
import { map } from 'rxjs/operators';
import { LabRichTextObjectType, LabRichTextService } from '../../../../entity-service/lab-rich-text.service';

/**
 * Component used in the Text editor to show a resource view.
 * It supports both report and enote views.
 */
@Component({
  selector: 'lab-rich-text-view',
  templateUrl: './lab-rich-text-view.component.html',
  styleUrls: ['./lab-rich-text-view.component.scss']
})
export class LabRichTextViewComponent extends TeElementBlockDirective {

  @Input() resourceId: string;

  @Input() viewConfig: RvViewConfig;

  @Input() viewTitle: string;

  @Input() caption: string;

  view$: Observable<LabResourceViewData>;

  constructor(private resourceService: LabResourceService,
              private enoteService: LabResourceENoteService,
              private richTextService: LabRichTextService) {
    super();
  }


  public setReportInput(resourceId: string, viewConfig: RvViewConfig, viewTitle: string, caption: string): void {
    this.resourceId = resourceId;
    this.viewConfig = viewConfig;
    this.viewTitle = viewTitle;
    this.caption = caption;

    if (resourceId && viewConfig) {
      this.view$ = this.resourceService.callResourceViewData(resourceId, viewConfig.methodName,
        viewConfig.configValues);
    }
  }

  public setEnoteInput(enoteResourceId: string, subResourceKey: string, viewConfig: RvViewConfig,
                       viewTitle: string, caption: string): void {
    this.resourceId = enoteResourceId;
    this.viewConfig = viewConfig;
    this.viewTitle = viewTitle;
    this.caption = caption;
    this.view$ = this.enoteService.callResourceView(enoteResourceId, subResourceKey, viewConfig.methodName,
      viewConfig.configValues).pipe(
      map(view => view.view)
    );
  }

  public setFileViewInput(objectType: LabRichTextObjectType, objectId: string, filename: string, title: string, caption: string): void {
    this.view$ = this.richTextService.getFileView(objectType, objectId, filename).pipe(
      map(view => view.view)
    );
    this.viewTitle = title;
    this.caption = caption;
  }
}
