import { Type } from '@angular/core';
import { BlockToolData } from '@editorjs/editorjs/types/tools/block-tool-data';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { TeComponentBlock, TeHelper, TeSourceUrlRegistry } from '@monorepo/text-editor';
import { catchError, EMPTY, from, switchMap } from 'rxjs';

import {
  HaResourceViewInputDialogComponent,
  HaResourceViewInputDialogData,
  HaResourceViewInputDialogOutputData,
} from '../../../ha-core/ha-component/ha-resource-view-input-dialog/ha-resource-view-input-dialog.component';
import { HaDocumentationService } from '../../../ha-core/ha-service/ha-documentation.service';
import { HaDocContentViewComponent } from './ha-doc-content-view/ha-doc-content-view.component';

export interface HaDocViewConfig {
  filename: string;
  id: string;
  title: string;
  caption: string;
}

/**
 * EditorJS custom block for embedding resource views (charts, tables) in documentation.
 *
 * Extends TeComponentBlock from the text-editor lib, which bridges EditorJS blocks
 * with Angular components. The pattern is the same for stories (HaStoryContentViewBlock)
 * and agents (HaAgentContentViewBlock).
 *
 * Key flow:
 * 1. User clicks "+" in the editor → appendCallback() opens a file upload dialog.
 * 2. User uploads a JSON view file → insertResourceView() saves the block data.
 * 3. initInputs() loads the view from the API and passes it to the Angular component.
 *
 * Cross-document copy support: when a view block is pasted into a different document,
 * initInputs() detects the missing file (catchError) and re-downloads it from the
 * source document URL stored in data attributes (TeSourceUrlRegistry).
 */
export class HaDocContentViewBlock extends TeComponentBlock<HaDocContentViewComponent> {
  public static readonly TAG_NAME = 'ha-report-content-view';

  static override get toolbox(): ToolboxConfig {
    return {
      title: TeHelper.getTranslateService().translate('resource_view'),
      icon: TeHelper.getMatIconElement('add_chart'),
    };
  }

  getComponentType(): Type<HaDocContentViewComponent> {
    return HaDocContentViewComponent;
  }

  getTagName(): string {
    return HaDocContentViewBlock.TAG_NAME;
  }

  initInputs(data: HaDocViewConfig): void {
    this.componentInstance.viewConfig = data;

    const docService = this.envInjector.get(HaDocumentationService);

    if (data.filename == null) return;

    // Set source URL attributes for cross-document copy support
    const viewUrl = docService.getViewUrl(this.additionalData, data.filename);
    this.htmlElement.setAttribute('data-te-source-url', viewUrl);
    this.htmlElement.setAttribute('data-te-source-filename', data.filename);

    // Check if a source URL was registered (cross-document paste)
    const sourceUrl = TeSourceUrlRegistry.consume(data.filename);

    this.componentInstance.view$ = docService.getView(this.additionalData, data.filename).pipe(
      catchError(() => {
        if (!sourceUrl) return EMPTY;

        // Re-download from source and re-upload to current document
        return from(fetch(sourceUrl, { credentials: 'include' }).then((r) => r.blob())).pipe(
          switchMap((blob) => {
            const formData = new FormData();
            formData.append('file', new File([blob], data.filename));
            return docService.uploadDocResourceViewFile(this.additionalData, formData);
          }),
          switchMap((res: any) => {
            // Update block data with new filename
            data.filename = res.filename;
            this.options.data = data;
            this.htmlElement.setAttribute('data-te-source-filename', res.filename);
            const newViewUrl = docService.getViewUrl(this.additionalData, res.filename);
            this.htmlElement.setAttribute('data-te-source-url', newViewUrl);
            return docService.getView(this.additionalData, res.filename);
          })
        );
      })
    );
  }

  // this is only for read only mode
  save(): BlockToolData {
    return this.data;
  }

  override appendCallback(): void {
    this.openSelectResourceView();
  }

  public openSelectResourceView(): void {
    const dialogService: FlDialogService = this.envInjector.get(FlDialogService);
    const docService = this.envInjector.get(HaDocumentationService);
    const data: HaResourceViewInputDialogData = {
      entityId: this.additionalData,
      headerTranslationKey: 'add_a_view_to_the_doc',
      uploadFn: (entityId, file) => docService.uploadDocResourceViewFile(entityId, file),
    };
    dialogService
      .openSmallDialog(HaResourceViewInputDialogComponent, { data })
      .afterClosed()
      .subscribe((res) => this.insertResourceView(res));
  }

  private insertResourceView(res?: HaResourceViewInputDialogOutputData): void {
    if (res == null || res.filename == null || res.view == null) {
      this.destroy();
      this.options.api.blocks.delete(this.options.api.blocks.getBlockIndex(this.options.block.id));
      return;
    }
    this.options.data = {
      id: ClStringHelper.generateUUID() + '_' + new Date().getTime(),
      filename: res.filename,
      title: res.view.title,
      caption: null,
    };
    this.initInputs(this.data);
  }
}
