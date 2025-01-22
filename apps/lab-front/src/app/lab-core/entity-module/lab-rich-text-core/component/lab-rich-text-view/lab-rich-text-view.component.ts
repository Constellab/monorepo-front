import { Component, Input, inject } from '@angular/core';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import { LabResourceViewData } from '../../../../model/entities/resource/lab-resource-view.entity';
import { Observable } from 'rxjs';
import { RvViewConfig } from '@monorepo/resource-view';
import { TeElementBlockDirective } from '@monorepo/text-editor';
import { LabNoteResourceService } from '../../../../entity-service/lab-note-resource.service';
import { map } from 'rxjs/operators';
import { LabRichTextObjectType, LabRichTextService } from '../../../../entity-service/lab-rich-text.service';
import { RvResourceViewModule } from '../../../../../../../../../libs/resource-view/src/lib/rv-resource-view.module';

/**
 * Component used in the Text editor to show a resource view.
 * It supports both note and note resource views.
 */
@Component({
  selector: 'lab-rich-text-view',
  templateUrl: './lab-rich-text-view.component.html',
  styleUrls: ['./lab-rich-text-view.component.scss'],
  imports: [RvResourceViewModule],
})
export class LabRichTextViewComponent extends TeElementBlockDirective {
  private resourceService = inject(LabResourceService);
  private noteResourceService = inject(LabNoteResourceService);
  private richTextService = inject(LabRichTextService);

  @Input() resourceId: string;

  @Input() viewConfig: RvViewConfig;

  @Input() viewTitle: string;

  @Input() caption: string;

  view$: Observable<LabResourceViewData>;

  constructor() {
    super();
  }

  public setNoteInput(
    resourceId: string,
    viewConfig: RvViewConfig,
    viewTitle: string,
    caption: string
  ): void {
    this.resourceId = resourceId;
    this.viewConfig = viewConfig;
    this.viewTitle = viewTitle;
    this.caption = caption;

    if (resourceId && viewConfig) {
      this.view$ = this.resourceService.callResourceViewData(
        resourceId,
        viewConfig.methodName,
        viewConfig.configValues
      );
    }
  }

  public setNoteResourceInput(
    noteResourceId: string,
    subResourceKey: string,
    viewConfig: RvViewConfig,
    viewTitle: string,
    caption: string
  ): void {
    this.resourceId = noteResourceId;
    this.viewConfig = viewConfig;
    this.viewTitle = viewTitle;
    this.caption = caption;
    this.view$ = this.noteResourceService
      .callResourceView(noteResourceId, subResourceKey, viewConfig.methodName, viewConfig.configValues)
      .pipe(map((view) => view.view));
  }

  public setFileViewInput(
    objectType: LabRichTextObjectType,
    objectId: string,
    filename: string,
    title: string,
    caption: string
  ): void {
    this.view$ = this.richTextService
      .getFileView(objectType, objectId, filename)
      .pipe(map((view) => view.view));
    this.viewTitle = title;
    this.caption = caption;
  }
}
