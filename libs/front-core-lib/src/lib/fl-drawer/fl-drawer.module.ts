import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlDrawerOpenerComponent } from './component/fl-drawer-opener/fl-drawer-opener.component';
import { FlSidebarLayoutComponent } from './component/fl-sidebar-layout/fl-sidebar-layout.component';
import { FlSidebarToggleComponent } from './component/fl-sidebar-toggle/fl-sidebar-toggle.component';
import { FlDrawerCloseDirective } from './directive/fl-drawer-close/fl-drawer-close.directive';
import { FlDrawerOverDirective } from './directive/fl-drawer-over/fl-drawer-over.directive';
import { FlDrawerToggleDirective } from './directive/fl-drawer-toggle/fl-drawer-toggle.directive';
import { FL_DRAWER_I18N } from './i18n/fl-drawer.i18n';

@NgModule({
  declarations: [
    FlDrawerOpenerComponent,
    FlSidebarLayoutComponent,
    FlSidebarToggleComponent,

    FlDrawerCloseDirective,
    FlDrawerOverDirective,
    FlDrawerToggleDirective,
  ],
  exports: [
    FlDrawerOpenerComponent,
    FlSidebarLayoutComponent,
    FlSidebarToggleComponent,
    FlDrawerCloseDirective,
    FlDrawerOverDirective,
    FlDrawerToggleDirective,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatTooltipModule,
    FlTranslateModule,
  ],
})
export class FlDrawerModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlDrawerModule', FL_DRAWER_I18N);
  }
}
