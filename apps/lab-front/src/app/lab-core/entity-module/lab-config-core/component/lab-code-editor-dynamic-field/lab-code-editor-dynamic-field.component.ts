import { Component, Input, OnInit } from '@angular/core';
import { FlCodeEditorLanguage, FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib';
import { TdParamSpecType } from '@monorepo/technical-doc';

/**
 * Component used under {@link FlDynamicFieldComponent} to show
 * code editor.
 */
@Component({
    selector: 'lab-code-editor-dynamic-field',
    templateUrl: './lab-code-editor-dynamic-field.component.html',
    styleUrls: ['./lab-code-editor-dynamic-field.component.scss'],
    standalone: false
})
export class LabCodeEditorDynamicFieldComponent extends FlDynamicFieldAbstractDirective implements OnInit {
  @Input() specType: TdParamSpecType;

  language: FlCodeEditorLanguage;

  async ngOnInit(): Promise<void> {
    this.language = this.getCodeEditorLanguage();
  }

  private getCodeEditorLanguage(): FlCodeEditorLanguage {
    switch (this.specType) {
      case 'python_code_param':
        return 'python';
      case 'r_code_param':
        return 'r';
      case 'bash_code_param':
        return 'shell';
      case 'json_code_param':
        return 'json';
      case 'yaml_code_param':
        return 'yaml';
      case 'julia_code_param':
        return 'julia';
      case 'perl_code_param':
        return 'perl';
      default:
        throw new Error(`Unknown spec type ${this.specType}`);
    }
  }
}
