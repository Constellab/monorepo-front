import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';

import { FlVideoPlayButtonComponent } from './component/fl-video-play-button/fl-video-play-button.component';
import {
  FlVideoFullscreenComponent,
  FlVideoFullscreenDirective,
} from './directive/fl-video-fullscreen/fl-video-fullscreen.directive';

@NgModule({
  declarations: [FlVideoFullscreenDirective, FlVideoFullscreenComponent, FlVideoPlayButtonComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, FlCoreDirectiveModule],
  exports: [FlVideoFullscreenDirective, FlVideoPlayButtonComponent],
})
export class FlVideoModule {}
