import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { FlDrawerOpenerComponent } from './component/fl-drawer-opener/fl-drawer-opener.component';
import { FlDrawerCloseDirective } from './directive/fl-drawer-close/fl-drawer-close.directive';
import { FlDrawerOverDirective } from './directive/fl-drawer-over/fl-drawer-over.directive';
import { FlDrawerToggleDirective } from './directive/fl-drawer-toggle/fl-drawer-toggle.directive';

@NgModule({
  declarations: [
    FlDrawerOpenerComponent,

    FlDrawerCloseDirective,
    FlDrawerOverDirective,
    FlDrawerToggleDirective,
  ],
  exports: [FlDrawerOpenerComponent, FlDrawerCloseDirective, FlDrawerOverDirective, FlDrawerToggleDirective],
  imports: [CommonModule, MatIconModule],
})
export class FlDrawerModule {}
