import {ToolboxConfig} from '@editorjs/editorjs/types/tools/tool-settings';
import {FlCodeEditorLanguage, flRootInjector, FlTranslateService} from '@monorepo/front-core-lib';
import {TeComponentBlock} from './te-component-block.class';
import {TeCodeComponent} from '../component/te-code/te-code.component';
import {Type} from '@angular/core';
import {ClRichTextCode} from '@monorepo/core-lib';
import {FormControl} from '@angular/forms';

export class TeCodeBlock extends TeComponentBlock<TeCodeComponent> {

  public static readonly TAG_NAME = 'te-code';

  static override get toolbox(): ToolboxConfig {
    const translateService = flRootInjector.get(FlTranslateService);
    return [
      {
        icon: '<span class="material-icons-outlined">code</span>',
        title: translateService.translate('teTextEditor.code'),
      }
    ];
  }

  getComponentType(): Type<TeCodeComponent> {
    return TeCodeComponent;
  }

  getTagName(): string {
    return TeCodeBlock.TAG_NAME;
  }

  initInputs(data: ClRichTextCode): void {
    this.componentInstance.formControl = new FormControl({value: data.code, disabled: this.disabled});
    this.componentInstance.language = (data.language as FlCodeEditorLanguage) ?? 'python';
  }

  save(): ClRichTextCode {
    return {
      code: this.componentInstance.formControl.value,
      language: this.componentInstance.language,
    };
  }

  // ignore the formula if it is empty
  validate(blockData: ClRichTextCode): boolean {
    return blockData.code?.length > 0;
  }
}
