import { ApplicationRef, EnvironmentInjector, Type } from '@angular/core';
import { BlockToolConstructorOptions } from '@editorjs/editorjs/types/tools/block-tool';
import { BlockToolData } from '@editorjs/editorjs/types/tools/block-tool-data';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { LiRichTextObjectType, LiViewConfig } from '@monorepo/lab-lib/li-core';
import { LiSelectViewConfigDialogComponent } from '@monorepo/lab-lib/li-view-config';
import { TdParamSpecsValues } from '@monorepo/technical-doc';
import { TeComponentBlock, TeHelper } from '@monorepo/text-editor';

import { LiRichTextViewComponent } from './component/li-rich-text-view/li-rich-text-view.component';

export interface LiRichTextViewBlockAdditionalData {
  type: 'note' | 'note-resource' | 'note-file-view' | 'note-template-view-file';
  /**
   * if note, id of the note,
   * if note-resource, id of the note resource,
   * if note-file-view, id of the note
   * if note-template-view-file, id of the note template
   */
  entityId: string | null;
}

/**
 * Content for the note and note template
 */
export interface LiNoteContentView {
  id: string;
  resource_id: string;
  scenario_id?: string;
  view_method_name: string;
  view_config: TdParamSpecsValues;
  title: string;
  caption: string;
}

/**
 * Content for the note resource
 */
export interface LiNoteResourceContentView {
  id: string;
  sub_resource_key: string;
  view_method_name: string;
  view_config: TdParamSpecsValues;
  title: string;
  caption: string;
}

/**
 * Special type of view (for note) that are stored as a file and not attached to a resource
 */
export interface LiRichTextFileView {
  id: string;
  filename: string;
  title: string;
  caption: string;
}

/**
 * Block to show a resource view in the text editor
 */
export class LiRichTextViewBlock extends TeComponentBlock<LiRichTextViewComponent> {
  constructor(
    protected options: BlockToolConstructorOptions,
    protected readonly envInjector: EnvironmentInjector,
    protected readonly applicationRef: ApplicationRef,
    protected readonly additionalData: LiRichTextViewBlockAdditionalData
  ) {
    super(options, envInjector, applicationRef, additionalData);
  }

  public static readonly TAG_NAME = 'li-note-content-view';

  static override get toolbox(): ToolboxConfig {
    return {
      title: TeHelper.getTranslateService().translate('li.note_resource_view'),
      icon: TeHelper.getMatIconElement('add_chart'),
    };
  }

  getComponentType(): Type<LiRichTextViewComponent> {
    return LiRichTextViewComponent;
  }

  getTagName(): string {
    return LiRichTextViewBlock.TAG_NAME;
  }

  initInputs(data: LiNoteContentView | LiNoteResourceContentView | LiRichTextFileView): void {
    switch (this.additionalData.type) {
      case 'note':
        const noteData = data as LiNoteContentView;
        this.componentInstance.setNoteInput(
          noteData.resource_id,
          {
            methodName: noteData.view_method_name,
            configValues: noteData.view_config,
          },
          noteData.title,
          noteData.caption
        );
        break;
      case 'note-resource':
        const noteResourceData = data as LiNoteResourceContentView;
        this.componentInstance.setNoteResourceInput(
          this.additionalData.entityId,
          noteResourceData.sub_resource_key,
          {
            methodName: noteResourceData.view_method_name,
            configValues: noteResourceData.view_config,
          },
          noteResourceData.title,
          noteResourceData.caption
        );
        break;
      case 'note-file-view':
      case 'note-template-view-file':
        const fileViewData = data as LiRichTextFileView;
        const objectType: LiRichTextObjectType =
          this.additionalData.type === 'note-file-view'
            ? LiRichTextObjectType.NOTE
            : LiRichTextObjectType.NOTE_TEMPLATE;
        this.componentInstance.setFileViewInput(
          objectType,
          this.additionalData.entityId,
          fileViewData.filename,
          fileViewData.title,
          fileViewData.caption
        );
        break;
    }
  }

  save(): BlockToolData {
    return Object.assign(this.data, {
      title: this.componentInstance.viewTitle,
      caption: this.componentInstance.caption,
    });
  }

  validate(blockData: LiNoteContentView | LiNoteResourceContentView | LiRichTextFileView): boolean {
    if (!blockData.id) return false;
    switch (this.additionalData.type) {
      case 'note':
        const noteData = blockData as LiNoteContentView;
        return !!noteData.resource_id && noteData.view_config != null;
      case 'note-resource':
        const noteResourceContentView = blockData as LiNoteResourceContentView;
        return !!noteResourceContentView.sub_resource_key && !!noteResourceContentView.view_method_name;
      case 'note-file-view':
      case 'note-template-view-file':
        const fileViewData = blockData as LiRichTextFileView;
        return !!fileViewData.filename;
    }
  }

  override appendCallback(): void {
    this.openSelectResourceView();
  }

  public openSelectResourceView(): void {
    if (this.additionalData.type === 'note') {
      const dialogService: FlDialogService = this.envInjector.get(FlDialogService);
      dialogService
        .openBigDialog(LiSelectViewConfigDialogComponent, { data: this.additionalData.entityId })
        .afterClosed()
        .subscribe((viewConfig) => this.insertResourceView(viewConfig));
    }
  }

  private insertResourceView(viewConfig?: LiViewConfig): void {
    if (viewConfig == null) return;
    this.options.data = {
      id: viewConfig.id + '_' + new Date().getTime(),
      view_config_id: viewConfig.id,
      resource_id: viewConfig.resource.id,
      scenario_id: viewConfig.scenario?.id,
      view_method_name: viewConfig.viewName,
      view_config: viewConfig.configValues,
      title: viewConfig.title,
      caption: null,
    };
    this.initInputs(this.data);
  }

  // renderSettings(): HTMLElement | MenuConfig {
  //   return [{
  //     icon: '<span class="material-icons-outlined">edit</span>',
  //     title: this.translateService.translate('flTextEditor.edit_formula'),
  //     onActivate: () => this.componentInstance.updateFormula(),
  //   }];
  // }
}

/**
 * Override of the LiRichTextViewBlock to show a file view in the text editor
 * It works the same except it has no toolbox, so no button is shown in the editor toolboxes.
 * As this can't be added from the editor.
 */
export class LiRichTextFileViewBlock extends LiRichTextViewBlock {
  static override get toolbox(): ToolboxConfig {
    return null;
  }
}
