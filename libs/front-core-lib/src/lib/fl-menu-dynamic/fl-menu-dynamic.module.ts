import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

import { FlIconModule } from '../fl-svg-icon/fl-icon.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlMenuDynamicComponent } from './component/fl-menu-dynamic/fl-menu-dynamic.component';
import { FlMenuDynamicButtonComponent } from './component/fl-menu-dynamic-button/fl-menu-dynamic-button.component';
import { FlMenuDynamicPortalComponent } from './component/fl-menu-dynamic-portal/fl-menu-dynamic-portal.component';

/**
 * Module to create mat menu dynamically
 */
@NgModule({
  declarations: [FlMenuDynamicComponent, FlMenuDynamicPortalComponent, FlMenuDynamicButtonComponent],
  exports: [FlMenuDynamicComponent, FlMenuDynamicPortalComponent, FlMenuDynamicButtonComponent],
  imports: [
    CommonModule,
    RouterModule,

    FlTranslateModule,
    FlIconModule,

    MatMenuModule,
    MatIconModule,
    MatDividerModule,
  ],
})
export class FlMenuDynamicModule {}
