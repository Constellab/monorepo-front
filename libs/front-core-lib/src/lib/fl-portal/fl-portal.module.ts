import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FlPortalComponent } from './component/fl-portal/fl-portal.component';
import { FlPortalContentComponent } from './component/fl-portal-content/fl-portal-content.component';
import { FlPortalFooterComponent } from './component/fl-portal-footer/fl-portal-footer.component';
import { FlPortalHeaderComponent } from './component/fl-portal-header/fl-portal-header.component';
import {
  FlPortalHeaderButtonsComponent,
} from './component/fl-portal-header-buttons/fl-portal-header-buttons.component';
import { FlTooltipComponent } from './component/fl-tooltip/fl-tooltip.component';
import { FlPortalCloseDirective } from './directive/fl-portal-close.directive';
import { FlPortalZIndexDirective } from './directive/fl-portal-z-index.directive';
import { FlPortalService } from './service/fl-portal.service';
import { FlTooltipService } from './service/fl-tooltip.service';

/**
 * Core modules containing components
 */
@NgModule({
  declarations: [
    FlTooltipComponent,
    FlPortalCloseDirective,
    FlPortalHeaderComponent,
    FlPortalComponent,
    FlPortalContentComponent,
    FlPortalFooterComponent,
    FlPortalHeaderButtonsComponent,
    FlPortalZIndexDirective,
  ],
  exports: [
    FlPortalCloseDirective,
    FlPortalHeaderComponent,
    FlPortalComponent,
    FlPortalContentComponent,
    FlPortalFooterComponent,
    FlPortalHeaderButtonsComponent,
    FlPortalZIndexDirective,
  ],
  imports: [
    CommonModule,

    // Material
    PortalModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class FlPortalModule {
  public static forRoot(): ModuleWithProviders<FlPortalModule> {
    return {
      ngModule: FlPortalModule,
      providers: [FlPortalService, FlTooltipService],
    };
  }
}
