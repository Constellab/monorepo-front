import {Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {
  TdResourceFunction,
  TdResourceFunctionArg,
  TdResourceType,
  TdResourceView
} from '../../model/td-resource-type.class';
import {rvDefaultViewTypeInfos, RvResourceViewTypeInfo} from '@monorepo/resource-view';
import {ClStringHelper} from '@monorepo/core-lib';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'td-resource-doc',
  templateUrl: './td-resource-doc.component.html',
  styleUrls: ['./td-resource-doc.component.scss']
})
export class TdResourceDocComponent implements OnInit {

  @Input() resource: TdResourceType;

  views: RvResourceViewTypeInfo[] = [];

  orderedViews: TdResourceView[];

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              public activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.orderedViews = this.getOrderedResourceViews(this.resource.methods.views);
  }

  getFunctionCleanDocInfo(func: TdResourceFunction, getTechInfo: boolean = false): string[] {
    if (!func.doc) {
      return null;
    }
    const lines = func.doc.split('\n');
    const cleanLines = [];
    const techLines = [];
    for (const line of lines) {
      if (line.includes(':type') || line.includes(':param') || line.includes(':return') || line.includes(':rtype')) {
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

  getFuncArgDoc(func: TdResourceFunction, arg: TdResourceFunctionArg): string {
    const techDocLines = this.getFunctionCleanDocInfo(func, true);
    let res: string = '';
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

  getCleanType(type: string): string {
    if (type.startsWith('typing')) {
      return type.replace('typing.', '');
    }
    return type;
  }

  getOrderedResourceViews(views: TdResourceView[]): TdResourceView[] {
    //return views with the default view first
    const orderedViews = [];
    for (const v of views) {
      if (v.default_view) {
        orderedViews.unshift(v);
      } else {
        orderedViews.push(v);
      }
    }
    return orderedViews;
  }

  protected readonly rvDefaultViewTypeInfos = rvDefaultViewTypeInfos;
}
