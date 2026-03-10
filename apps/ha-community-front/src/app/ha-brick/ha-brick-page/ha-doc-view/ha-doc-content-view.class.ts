import { Type } from '@angular/core';
import { BlockToolData } from '@editorjs/editorjs/types/tools/block-tool-data';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { TeComponentBlock, TeHelper, TeSourceUrlRegistry } from '@monorepo/text-editor';
import { catchError, EMPTY, from, switchMap } from 'rxjs';

import { HaDocumentationService } from '../../../ha-core/ha-service/ha-documentation.service';
import { HaDocContentViewComponent } from './ha-doc-content-view/ha-doc-content-view.component';
import {
  HaDocResourceViewInputDialogComponent,
  HaDocResourceViewInputDialogOutputData,
} from './ha-doc-resource-view-input-dialog/ha-doc-resource-view-input-dialog.component';

export interface HaDocViewConfig {
  filename: string;
  id: string;
  title: string;
  caption: string;
}

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
    dialogService
      .openSmallDialog(HaDocResourceViewInputDialogComponent, { data: { docId: this.additionalData } })
      .afterClosed()
      .subscribe((res) => this.insertResourceView(res));
  }

  private insertResourceView(res?: HaDocResourceViewInputDialogOutputData): void {
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
