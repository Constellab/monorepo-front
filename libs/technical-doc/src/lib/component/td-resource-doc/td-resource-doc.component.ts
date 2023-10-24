import {Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {
  TdResourceFunction,
  TdResourceFunctionArg,
  TdResourceType,
  TdResourceView
} from '../../model/td-resource-type.class';
import {forEach} from '@angular-devkit/schematics';
import {rvDefaultViewTypeInfos, RvResourceViewType, RvResourceViewTypeInfo} from '@monorepo/resource-view';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'td-resource-doc',
  templateUrl: './td-resource-doc.component.html',
  styleUrls: ['./td-resource-doc.component.scss']
})
export class TdResourceDocComponent implements OnInit {

  @Input()
  resource: TdResourceType;

  views: RvResourceViewTypeInfo[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
  }

  ngOnInit(): void {
  }


  getFunctionSignature(func: TdResourceFunction): string {
    if(isPlatformBrowser(this.platformId)){
      const hljs = require('highlight.js');
      const signature = hljs.highlight('python', this.getFunctionSignatureToString(func)).value;
      return signature;
    }
    return '';
  }

  getFunctionSignatureToString(func: TdResourceFunction): string {
    return 'def ' + func.name + '(' + this.getFunctionArgsToString(func.args) + ') -> ' + (func.return_type ? func.return_type : 'void');
  }

  getFunctionArgsToString(args: TdResourceFunctionArg[]): string{
    return args.map(a => a.arg_name + ': ' + a.arg_type).join(', ');
  }

  getFunctionCleanDocInfo(func: TdResourceFunction, getTechInfo: boolean = false): string[] {
    if(!func.doc){
      return null;
    }
    const lines = func.doc.split('\n');
    const cleanLines = [];
    const techLines = [];
    for (const line of lines) {
      if (line.includes(':type') || line.includes(':param') || line.includes(':return') || line.includes(':rtype')) {
        techLines.push(line);
      } else {
        cleanLines.push(line);
      }

    }
    if (getTechInfo) {
      return techLines;
    }
    return cleanLines;
  }

  getFuncArgDoc(func: TdResourceFunction, arg: TdResourceFunctionArg): string {
    const techDocLines = this.getFunctionCleanDocInfo(func, true);
    let res: string;
    for (const line of techDocLines) {
      if (line.includes(':param ' + arg.arg_name)) {
        res = line.replace(':param ' + arg.arg_name + ':', '');
      } else if (line.includes(':type ' + arg.arg_name)) {
        res = line.replace(':type ' + arg.arg_name + ':', '');
      } else if (line.includes(':return ' + arg.arg_name)) {
        res = line.replace(':return ' + arg.arg_name + ':', '');
      }
    }
    return res;
  }

  getCleanType(type: string): string{
    if(type.startsWith('typing')){
      return type.replace('typing.', '');
    }
    return type;
  }

  getOrderedResourceViews(views: TdResourceView[]): TdResourceView[]{
    //return views with the default view first
    const orderedViews = [];
    for(const v of views){
      if(v.default_view){
        orderedViews.unshift(v);
      }else{
        orderedViews.push(v);
      }
    }
    return orderedViews;
  }

  protected readonly rvDefaultViewTypeInfos = rvDefaultViewTypeInfos;
}
