import { LabRichTextViewComponent } from './component/lab-rich-text-view/lab-rich-text-view.component';
import { PrConfigValues } from '@monorepo/protocol';
import { TeComponentBlock, TeHelper } from '@monorepo/text-editor';
import { ToolboxConfig } from '@editorjs/editorjs/types/tools/tool-settings';
import { ApplicationRef, EnvironmentInjector, Type } from '@angular/core';
import { BlockToolData } from '@editorjs/editorjs/types/tools/block-tool-data';
import { FlDialogService } from '@monorepo/front-core-lib';
import {
  LabSelectViewConfigDialogComponent
} from '../lab-view-config-core/component/lab-select-view-config-dialog/lab-select-view-config-dialog.component';
import { LabViewConfig } from '../../model/entities/resource/lab-view-config.entity';
import { BlockToolConstructorOptions } from '@editorjs/editorjs/types/tools/block-tool';
import { LabRichTextObjectType } from '../../entity-service/lab-rich-text.service';

export interface LabRichTextViewBlockAdditionalData {
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
export interface LabNoteContentView {
  id: string;
  resource_id: string;
  scenario_id?: string;
  view_method_name: string;
  view_config: PrConfigValues;
  title: string;
  caption: string;
}

/**
 * Content for the note resource
 */
export interface LabNoteResourceContentView {
  id: string;
  sub_resource_key: string;
  view_method_name: string;
  view_config: PrConfigValues;
  title: string;
  caption: string;
}

/**
 * Special type of view (for note) that are stored as a file and not attached to a resource
 */
export interface LabRichTextFileView {
  id: string;
  filename: string;
  title: string;
  caption: string;
}

/**
 * Block to show a resource view in the text editor
 */
export class LabRichTextViewBlock extends TeComponentBlock<LabRichTextViewComponent> {

  constructor(protected options: BlockToolConstructorOptions,
              protected readonly envInjector: EnvironmentInjector,
              protected readonly applicationRef: ApplicationRef,
              protected readonly additionalData: LabRichTextViewBlockAdditionalData) {
    super(options, envInjector, applicationRef, additionalData);
  }

  public static readonly TAG_NAME = 'lab-note-content-view';

  static override get toolbox(): ToolboxConfig {
    return {
      title: TeHelper.getTranslateService().translate('biox.note_resource_view'),
      icon: TeHelper.getMatIconElement('add_chart')
    };
  }

  getComponentType(): Type<LabRichTextViewComponent> {
    return LabRichTextViewComponent;
  }

  getTagName(): string {
    return LabRichTextViewBlock.TAG_NAME;
  }

  initInputs(data: LabNoteContentView | LabNoteResourceContentView | LabRichTextFileView): void {
    switch (this.additionalData.type) {
      case 'note':
        const noteData = data as LabNoteContentView;
        this.componentInstance.setNoteInput(noteData.resource_id,
          {
            methodName: noteData.view_method_name,
            configValues: noteData.view_config
          },
          noteData.title,
          noteData.caption
        );
        break;
      case 'note-resource':
        const noteResourceData = data as LabNoteResourceContentView;
        this.componentInstance.setNoteResourceInput(this.additionalData.entityId, noteResourceData.sub_resource_key,
          {
            methodName: noteResourceData.view_method_name,
            configValues: noteResourceData.view_config
          }, noteResourceData.title, noteResourceData.caption);
        break;
      case 'note-file-view':
      case 'note-template-view-file':
        const fileViewData = data as LabRichTextFileView;
        const objectType: LabRichTextObjectType = this.additionalData.type === 'note-file-view' ?
          LabRichTextObjectType.NOTE : LabRichTextObjectType.NOTE_TEMPLATE;
        this.componentInstance.setFileViewInput(objectType, this.additionalData.entityId,
          fileViewData.filename, fileViewData.title, fileViewData.caption);
        break;
    }
  }

  save(): BlockToolData {
    return Object.assign(this.data, {
      title: this.componentInstance.viewTitle,
      caption: this.componentInstance.caption
    });
  }

  validate(blockData: LabNoteContentView | LabNoteResourceContentView | LabRichTextFileView): boolean {
    if (!blockData.id) return false;
    switch (this.additionalData.type) {
      case 'note':
        const noteData = blockData as LabNoteContentView;
        return !!noteData.resource_id && noteData.view_config != null;
      case 'note-resource':
        const noteResourceContentView = blockData as LabNoteResourceContentView;
        return !!noteResourceContentView.sub_resource_key && !!noteResourceContentView.view_method_name;
      case 'note-file-view':
      case 'note-template-view-file':
        const fileViewData = blockData as LabRichTextFileView;
        return !!fileViewData.filename;
    }
  }


  override appendCallback(): void {
    this.openSelectResourceView();
  }

  public openSelectResourceView(): void {
    if (this.additionalData.type === 'note') {
      const dialogService: FlDialogService = this.envInjector.get(FlDialogService);
      dialogService.openBigDialog(LabSelectViewConfigDialogComponent, { data: this.additionalData.entityId }).afterClosed()
        .subscribe(viewConfig => this.insertResourceView(viewConfig));
    }
  }

  private insertResourceView(viewConfig?: LabViewConfig): void {
    if (viewConfig == null) return;
    this.options.data = {
      id: viewConfig.id + '_' + new Date().getTime(),
      resource_id: viewConfig.resource.id,
      scenario_id: viewConfig.scenario?.id,
      view_method_name: viewConfig.viewName,
      view_config: viewConfig.configValues,
      title: viewConfig.title,
      caption: null
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
 * Override of the LabRichTextViewBlock to show a file view in the text editor
 * It works the same except it has no toolbox, so no button is shown in the editor toolboxes. As this can't be added from the editor.
 */
export class LabRichTextFileViewBlock extends LabRichTextViewBlock {
  static override get toolbox(): ToolboxConfig {
    return null;
  }
}
