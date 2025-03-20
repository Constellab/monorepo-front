import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import {
  TdResourceFunctionArg,
  TdTechDocFunction,
  TdTechDocFunctionType,
} from '../../model/td-resource-type.class';

interface TdResourceFunctionArgWithDoc {
  arg: TdResourceFunctionArg;
  doc: string;
}

@Component({
  selector: 'td-resource-doc-func-info',
  templateUrl: './td-resource-doc-func-info.component.html',
  styleUrls: ['./td-resource-doc-func-info.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TdResourceDocFuncInfoComponent {
  func = input.required<TdTechDocFunction>();

  cleanedFuncDoc: Signal<string> = computed(() => this.getFunctionCleanDocInfo(this.func()));
  funcArgsDocs: Signal<TdResourceFunctionArgWithDoc[]> = computed(() => this.buildFuncArgDocs(this.func()));

  returnTypeName: Signal<string> = computed(() => {
    if (this.func().return_type === 'None' || this.func().return_type == null) {
      return null;
    }
    return this.func().return_type;
  });

  CLASS_METHOD = TdTechDocFunctionType.CLASSMETHOD;
  STATIC_METHOD = TdTechDocFunctionType.STATICMETHOD;

  private getFunctionCleanDocInfo(func: TdTechDocFunction): string {
    if (!func.doc) {
      return null;
    }
    const lines = func.doc.split('\n');
    const cleanLines = [];
    for (const line of lines) {
      if (
        line.includes(':type') ||
        line.includes(':param') ||
        line.includes(':return') ||
        line.includes(':rtype')
      ) {
        break;
      } else {
        cleanLines.push(line);
      }
    }

    if (cleanLines.length === 0) return null;
    return cleanLines.join('\n');
  }

  private buildFuncArgDocs(func: TdTechDocFunction): TdResourceFunctionArgWithDoc[] {
    const argDocs: TdResourceFunctionArgWithDoc[] = [];
    for (const arg of func.args) {
      const doc = this.getFuncArgDoc(func, arg);
      argDocs.push({ arg, doc });
    }
    return argDocs;
  }

  /**
   * Method to extract the description of an argument from the docstring of the method
   * Ex : for string ":param argName: argument name" it will extract 'argument_name'
   */
  private getFuncArgDoc(func: TdTechDocFunction, arg: TdResourceFunctionArg): string {
    if (!func.doc) {
      return null;
    }

    const pattern = new RegExp(`:param ${arg.arg_name}: (.+?)(?=, defaults to|\\n\\s*:\\w|\\Z)`, 's');
    const match = pattern.exec(func.doc);
    if (match) {
      return match[1].trim();
    }
    return null;
  }
}
