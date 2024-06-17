import {Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {TdTechDocFunction, TdResourceFunctionArg, TdTechDocFunctionType} from '../../model/td-resource-type.class';
import {isPlatformBrowser} from '@angular/common';
import {TeHighlight} from '../../model/td-highlight.class';

@Component({
  selector: 'td-resource-doc-function-signature',
  templateUrl: './td-resource-doc-function-signature.component.html',
  styleUrls: ['./td-resource-doc-function-signature.component.scss']
})
export class TdResourceDocFunctionSignatureComponent implements OnInit {

  @Input({required: true}) func: TdTechDocFunction;

  @ViewChild('signature', {static: true}) signature: ElementRef;

  methodType: TdTechDocFunctionType;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
  }

  ngOnInit(): void {
    this.signature.nativeElement.innerHTML = this.getFunctionSignature(this.func)
  }

  getFunctionSignature(func: TdTechDocFunction): string {
    if (isPlatformBrowser(this.platformId)) {
      return TeHighlight.highlight(this.getFunctionSignatureToString(func), 'python');
    }
    return '';
  }

  getFunctionSignatureToString(func: TdTechDocFunction): string {
    this.methodType = func.method_type;
    return 'def ' + func.name + '(' + this.getFunctionArgsToString(func.args) + ') -> ' + (func.return_type ? func.return_type : 'void');
  }

  getFunctionArgsToString(args: TdResourceFunctionArg[]): string {
    return args.map(a => {
      if (a.arg_default_value.length > 0)
        return a.arg_name + ': ' + a.arg_type + ' = ' + a.arg_default_value;
      return a.arg_name + ': ' + a.arg_type;
    }).join(', ');
  }
}
