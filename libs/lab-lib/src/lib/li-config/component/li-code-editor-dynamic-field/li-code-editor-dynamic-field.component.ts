import { Component, Input, OnInit } from '@angular/core';
import { MatError } from '@angular/material/form-field';
import { FlCodeEditorLanguage, FlCodeEditorModule } from '@monorepo/front-core-lib/fl-code-editor';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib/fl-dynamic-field';
import { TdParamSpecType } from '@monorepo/technical-doc';

/**
 * Component used under {@link FlDynamicFieldComponent} to show
 * code editor.
 */
@Component({
  selector: 'li-code-editor-dynamic-field',
  templateUrl: './li-code-editor-dynamic-field.component.html',
  styleUrls: ['./li-code-editor-dynamic-field.component.scss'],
  imports: [FlCodeEditorModule, FlCorePipeModule, MatError],
})
export class LiCodeEditorDynamicFieldComponent extends FlDynamicFieldAbstractDirective implements OnInit {
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
