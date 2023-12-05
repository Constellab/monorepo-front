import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlRoundImageComponent} from './fl-round-image/fl-round-image.component';
import {
  FlImageFullscreenDirective,
  FlImageFullscreenTestComponent
} from './fl-image-fullscreen/fl-image-fullscreen.directive';
import {FlDialogModule} from '../fl-dialog/fl-dialog.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {FlCoreDirectiveModule} from '../fl-core-directive/fl-core-directive.module';

/**
 * Module that contains Component to display Images.
 *
 * Contains: RoundImage
 */
@NgModule({
  declarations: [FlRoundImageComponent, FlImageFullscreenDirective, FlImageFullscreenTestComponent],
  exports: [FlRoundImageComponent, FlImageFullscreenDirective],
  imports: [
    CommonModule,

    MatButtonModule,
    MatIconModule,
    MatDialogModule,

    FlDialogModule,
    FlCoreDirectiveModule,
  ],
})
export class FlImageModule {
}
