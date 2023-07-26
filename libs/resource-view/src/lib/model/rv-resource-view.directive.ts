import {Directive, Input} from '@angular/core';
import {RvResourceViewBase} from './rv-resource-view.class';
import {RvViewConfig} from './rv-view-config.class';
import {FlMenuDynamic} from '@monorepo/front-core-lib';


@Directive()
export class RvResourceViewDirective<T extends RvResourceViewBase = RvResourceViewBase> {

  @Input() view: T;

  @Input() resourceId: string;

  @Input() config: RvViewConfig;

  // if provided the view will support a right click. (only supported by view chart2d for now)
  @Input() contextMenuItems?: FlMenuDynamic[];

}
