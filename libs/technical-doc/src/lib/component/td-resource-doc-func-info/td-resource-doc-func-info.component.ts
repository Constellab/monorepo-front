import { Component, Input, OnInit } from '@angular/core';
import { TdTechDocFunction, TdResourceFunctionArg } from '../../model/td-resource-type.class';
import { ClStringHelper } from '@monorepo/core-lib';

@Component({
  selector: 'td-resource-doc-func-info',
  templateUrl: './td-resource-doc-func-info.component.html',
  styleUrls: ['./td-resource-doc-func-info.component.scss'],
  standalone: false,
})
export class TdResourceDocFuncInfoComponent implements OnInit {
  @Input({ required: true }) func: TdTechDocFunction;
  cleanedFuncDoc: string[];
  funcAgrsDocs: string[] = [];

  ngOnInit(): void {
    this.cleanedFuncDoc = this.getFunctionCleanDocInfo(this.func);
    for (const arg of this.func.args) {
      this.funcAgrsDocs.push(this.getFuncArgDoc(this.func, arg));
    }
  }

  getFunctionCleanDocInfo(func: TdTechDocFunction, getTechInfo: boolean = false): string[] {
    if (!func.doc) {
      return null;
    }
    const lines = func.doc.split('\n');
    const cleanLines = [];
    const techLines = [];
    for (const line of lines) {
      if (
        line.includes(':type') ||
        line.includes(':param') ||
        line.includes(':return') ||
        line.includes(':rtype')
      ) {
        techLines.push(line.trim());
      } else {
        cleanLines.push(line);
      }
    }
    if (getTechInfo) {
      return techLines;
    }
    return cleanLines;
  }

  getFuncArgDoc(func: TdTechDocFunction, arg: TdResourceFunctionArg): string {
    const techDocLines = this.getFunctionCleanDocInfo(func, true);
    let res: string = '';
    if (techDocLines == null || techDocLines.length == 0) return res;
    for (const line of techDocLines) {
      if (line.includes(':param ' + arg.arg_name)) {
        res += line.replace(':param ' + arg.arg_name + ':', '');
      }
      if (line.includes(':type ' + arg.arg_name)) {
        res += line.replace(':type ' + arg.arg_name + ':', '');
      }
      if (line.includes(':return ' + arg.arg_name)) {
        res += line.replace(':return ' + arg.arg_name + ':', '');
      }
      res += '\n';
    }

    if (res.includes(arg.arg_type)) {
      res = res.replace(arg.arg_type, '');
    }
    if (res.includes(arg.arg_type + ', ')) {
      res = res.replace(arg.arg_type + ', ', '');
    }
    return ClStringHelper.capitalize(res.trim());
  }
}
