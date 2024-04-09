import {Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {TdResourceFunction, TdResourceFunctionArg} from '../../model/td-resource-type.class';
import {isPlatformBrowser} from '@angular/common';
import hljs from 'highlight.js/lib/core';

@Component({
  selector: 'td-resource-doc-function-signature',
  templateUrl: './td-resource-doc-function-signature.component.html',
  styleUrls: ['./td-resource-doc-function-signature.component.scss']
})
export class TdResourceDocFunctionSignatureComponent implements OnInit {

  @Input({required: true}) func: TdResourceFunction;

  @ViewChild('signature', {static: true}) signature: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
  }

  ngOnInit(): void {
    this.signature.nativeElement.innerHTML = this.getFunctionSignature(this.func)
  }

  getFunctionSignature(func: TdResourceFunction): string {
    if (isPlatformBrowser(this.platformId)) {
      return hljs.highlight('python', this.getFunctionSignatureToString(func)).value;
    }
    return '';
  }

  getFunctionSignatureToString(func: TdResourceFunction): string {
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
