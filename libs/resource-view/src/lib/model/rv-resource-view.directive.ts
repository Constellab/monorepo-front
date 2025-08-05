import { Directive, Input } from '@angular/core';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';

import { RvResourceViewBase } from './rv-resource-view.class';
import { RvResourceViewModuleConfig } from './rv-resource-view-module.config';
import { RvViewConfig } from './rv-view-config.class';

@Directive()
export class RvResourceViewDirective<T extends RvResourceViewBase = RvResourceViewBase> {
  @Input({ required: true }) view: T;

  @Input() resourceId?: string;

  @Input() config?: RvViewConfig;

  // if provided the view will support a right click. (only supported by view chart2d for now)
  @Input() contextMenuItems?: FlMenuDynamic[];

  /**
   * Config object for the module.
   */
  @Input({ required: true }) moduleConfig: RvResourceViewModuleConfig;
}
