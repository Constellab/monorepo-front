import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlCardImageComponent } from './fl-card-image/fl-card-image.component';
import { FlCardActionsComponent } from './fl-card-actions/fl-card-actions.component';
import { FlCardBodyComponent } from './fl-card-body/fl-card-body.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FlCardFooterComponent } from './fl-card-footer/fl-card-footer.component';
import { FlLoadingCardComponent } from './fl-loading-card/fl-loading-card.component';
import { FlCardHeaderComponent } from './fl-card-header/fl-card-header.component';
import { FlCardComponent } from './fl-card/fl-card.component';
import { FlImageModule } from '@monorepo/front-core-lib/fl-image';

/**
 * Custom card with colored header
 */
@NgModule({
  declarations: [
    FlCardComponent,
    FlCardHeaderComponent,
    FlCardActionsComponent,
    FlCardBodyComponent,
    FlCardImageComponent,
    FlCardFooterComponent,
    FlLoadingCardComponent,
  ],
  exports: [
    FlCardComponent,
    FlCardHeaderComponent,
    FlCardActionsComponent,
    FlCardBodyComponent,
    FlCardImageComponent,
    FlCardFooterComponent,
    FlLoadingCardComponent,
  ],
  imports: [CommonModule, FlImageModule, ScrollingModule],
})
export class FlCardModule {}
