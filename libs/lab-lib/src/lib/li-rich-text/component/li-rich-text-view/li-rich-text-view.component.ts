import { ChangeDetectionStrategy,Component, inject, Input } from '@angular/core';
import {
  LiNoteResourceService,
  LiResourceService,
  LiResourceViewData,
  LiRichTextObjectType,
  LiRichTextService,
} from '@monorepo/lab-lib/li-core';
import { RvResourceViewModule, RvViewConfig } from '@monorepo/resource-view';
import { TeElementBlockDirective } from '@monorepo/text-editor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Component used in the Text editor to show a resource view.
 * It supports both note and note resource views.
 */
@Component({
  selector: 'li-rich-text-view',
  templateUrl: './li-rich-text-view.component.html',
  styleUrls: ['./li-rich-text-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RvResourceViewModule],
})
export class LiRichTextViewComponent extends TeElementBlockDirective {
  private resourceService = inject(LiResourceService);
  private noteResourceService = inject(LiNoteResourceService);
  private richTextService = inject(LiRichTextService);

  @Input() resourceId: string;

  @Input() viewConfig: RvViewConfig;

  @Input() viewTitle: string;

  @Input() caption: string;

  view$: Observable<LiResourceViewData>;

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
    objectType: LiRichTextObjectType,
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
