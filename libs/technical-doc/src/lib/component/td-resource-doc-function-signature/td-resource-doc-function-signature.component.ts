import { Component, ElementRef, inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import {
  TdResourceFunctionArg,
  TdTechDocFunction,
  TdTechDocFunctionType,
} from '../../model/td-resource-type.class';
import { isPlatformBrowser } from '@angular/common';
import { FlHighlight } from '@monorepo/front-core-lib/fl-markdown';

@Component({
  selector: 'td-resource-doc-function-signature',
  templateUrl: './td-resource-doc-function-signature.component.html',
  styleUrls: ['./td-resource-doc-function-signature.component.scss'],
  standalone: false,
})
export class TdResourceDocFunctionSignatureComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  @Input({ required: true }) func: TdTechDocFunction;

  @ViewChild('signature', { static: true }) signature: ElementRef;

  methodType: TdTechDocFunctionType;

  ngOnInit(): void {
    this.signature.nativeElement.innerHTML = this.getFunctionSignature(this.func);
  }

  private getFunctionSignature(func: TdTechDocFunction): string {
    if (isPlatformBrowser(this.platformId)) {
      return FlHighlight.highlight(this.getFunctionSignatureToString(func), 'python');
    }
    return '';
  }

  private getFunctionSignatureToString(func: TdTechDocFunction): string {
    this.methodType = func.method_type;
    return (
      'def ' +
      func.name +
      '(' +
      this.getFunctionArgsToString(func.args) +
      ') -> ' +
      (func.return_type ? func.return_type : 'void')
    );
  }

  private getFunctionArgsToString(args: TdResourceFunctionArg[]): string {
    return args
      .map((a) => {
        if (a.arg_default_value.length > 0)
          return a.arg_name + ': ' + a.arg_type + ' = ' + a.arg_default_value;
        return a.arg_name + ': ' + a.arg_type;
      })
      .join(', ');
  }
}
