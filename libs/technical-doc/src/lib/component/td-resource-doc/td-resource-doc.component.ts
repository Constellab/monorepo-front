import {Component, Input, OnInit} from '@angular/core';
import {
  TdResourceFunction,
  TdResourceFunctionArg,
  TdResourceType,
  TdResourceView
} from '../../model/td-resource-type.class';
import {forEach} from '@angular-devkit/schematics';
import {rvDefaultViewTypeInfos, RvResourceViewType, RvResourceViewTypeInfo} from '@monorepo/resource-view';

@Component({
  selector: 'td-resource-doc',
  templateUrl: './td-resource-doc.component.html',
  styleUrls: ['./td-resource-doc.component.scss']
})
export class TdResourceDocComponent implements OnInit {

  @Input()
  resource: TdResourceType;

  views: RvResourceViewTypeInfo[] = [];

  constructor() {
  }

  ngOnInit(): void {
    for(const v of this.resource.methods.views){
      console.log('A', v.view_type);
    }
  }


  getFunctionSignature(func: TdResourceFunction): string {
    return '(' + this.getFunctionArgsToString(func.args) + ') -> ' + (func.return_type ? func.return_type : 'void');
  }

  getFunctionArgsToString(args: TdResourceFunctionArg[]): string{
    return args.map(a => a.arg_name + ': ' + a.arg_type).join(', ');
  }

  getFunctionCleanDocInfo(func: TdResourceFunction, getTechInfo: boolean = false): string[] {
    //check foreach doc line if it countains :type or :param or :return
    //if yes, remove it
    //if no, return the line
    if(!func.doc){
      return null;
    }
    const lines = func.doc.split('\n');
    const cleanLines = [];
    const techLines = [];
    for (const line of lines) {
      if (line.includes(':type') || line.includes(':param') || line.includes(':return')) {
        techLines.push(line);
      }
      cleanLines.push(line);
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
