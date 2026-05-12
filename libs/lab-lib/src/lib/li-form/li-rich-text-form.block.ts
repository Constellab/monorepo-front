import { ApplicationRef, EnvironmentInjector, Type } from '@angular/core';
import { MenuConfig } from '@editorjs/editorjs/types/tools';
import { BlockToolConstructorOptions } from '@editorjs/editorjs/types/tools/block-tool';
import { BlockToolData } from '@editorjs/editorjs/types/tools/block-tool-data';
import { ToolboxConfigEntry } from '@editorjs/editorjs/types/tools/tool-settings';
import { TeComponentBlock, TeHelper } from '@monorepo/text-editor';

import { LiRichTextFormComponent } from './component/li-rich-text-form/li-rich-text-form.component';
import {
  LiRichTextFormBlockAdditionalData,
  LiRichTextFormBlockData,
  LiRichTextFormDisplayMode,
} from './model/li-rich-text-form-block.model';

export class LiRichTextFormBlock extends TeComponentBlock<LiRichTextFormComponent> {
  public static readonly TAG_NAME = 'li-note-content-form';

  constructor(
    protected options: BlockToolConstructorOptions,
    protected readonly envInjector: EnvironmentInjector,
    protected readonly applicationRef: ApplicationRef,
    protected readonly additionalData: LiRichTextFormBlockAdditionalData
  ) {
    super(options, envInjector, applicationRef, additionalData);
  }

  static override get toolbox(): ToolboxConfigEntry[] {
    return [
      {
        title: TeHelper.getTranslateService().translate('li.form_insert_new'),
        icon: TeHelper.getMatIconElement('description'),
        data: { insertMode: 'create' },
      },
      {
        title: TeHelper.getTranslateService().translate('li.form_reference_existing'),
        icon: TeHelper.getMatIconElement('link'),
        data: { insertMode: 'reference' },
      },
    ];
  }

  getComponentType(): Type<LiRichTextFormComponent> {
    return LiRichTextFormComponent;
  }

  getTagName(): string {
    return LiRichTextFormBlock.TAG_NAME;
  }

  initInputs(data: LiRichTextFormBlockData): void {
    this.componentInstance.formId = data.form_id;
    this.componentInstance.isOwner = data.is_owner;
    this.componentInstance.displayMode.set(data.display_mode ?? 'form');
  }

  save(): BlockToolData {
    return {
      form_id: this.componentInstance.formId,
      is_owner: this.componentInstance.isOwner,
      display_mode: this.componentInstance.displayMode(),
    };
  }

  validate(data: LiRichTextFormBlockData): boolean {
    return !!data.form_id;
  }

  renderSettings(): MenuConfig {
    const t = TeHelper.getTranslateService();
    const current = this.componentInstance.displayMode();
    return [
      {
        icon: TeHelper.getMatIconElement('edit_note'),
        title: t.translate('li.form_display_form'),
        onActivate: () => this.setDisplayMode('form'),
        closeOnActivate: true,
        isActive: current === 'form',
      },
      {
        icon: TeHelper.getMatIconElement('table_chart'),
        title: t.translate('li.form_display_table'),
        onActivate: () => this.setDisplayMode('table'),
        closeOnActivate: true,
        isActive: current === 'table',
      },
      {
        icon: TeHelper.getMatIconElement('data_object'),
        title: t.translate('li.form_display_json'),
        onActivate: () => this.setDisplayMode('json'),
        closeOnActivate: true,
        isActive: current === 'json',
      },
    ];
  }

  private setDisplayMode(mode: LiRichTextFormDisplayMode): void {
    this.componentInstance.displayMode.set(mode);
  }

  override appendCallback(): void {
    const insertMode = this.data?.insertMode;
    if (insertMode === 'reference') {
      this.componentInstance.openSelectExistingForm();
    } else {
      this.componentInstance.openCreateNewForm();
    }
  }
}
