import { ChangeDetectionStrategy,Component, Input, OnInit } from '@angular/core';
import { MatError } from '@angular/material/form-field';
import { FlCodeEditorLanguage, FlCodeEditorModule } from '@monorepo/front-core-lib/fl-code-editor';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib/fl-dynamic-field';
import { TdParamSpecTypeEnum } from '@monorepo/technical-doc';

/**
 * Component used under {@link FlDynamicFieldComponent} to show
 * code editor.
 */
@Component({
  selector: 'li-code-editor-dynamic-field',
  templateUrl: './li-code-editor-dynamic-field.component.html',
  styleUrls: ['./li-code-editor-dynamic-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlCodeEditorModule, FlCorePipeModule, MatError],
})
export class LiCodeEditorDynamicFieldComponent extends FlDynamicFieldAbstractDirective implements OnInit {
  @Input() specType: TdParamSpecTypeEnum;

  language: FlCodeEditorLanguage;

  async ngOnInit(): Promise<void> {
    this.language = this.getCodeEditorLanguage();
  }

  private getCodeEditorLanguage(): FlCodeEditorLanguage {
    switch (this.specType) {
      case TdParamSpecTypeEnum.PYTHON_CODE_PARAM:
        return 'python';
      case TdParamSpecTypeEnum.R_CODE_PARAM:
        return 'r';
      case TdParamSpecTypeEnum.BASH_CODE_PARAM:
        return 'shell';
      case TdParamSpecTypeEnum.JSON_CODE_PARAM:
        return 'json';
      case TdParamSpecTypeEnum.YAML_CODE_PARAM:
        return 'yaml';
      case TdParamSpecTypeEnum.JULIA_CODE_PARAM:
        return 'julia';
      case TdParamSpecTypeEnum.PERL_CODE_PARAM:
        return 'perl';
      default:
        throw new Error(`Unknown spec type ${this.specType}`);
    }
  }
}
