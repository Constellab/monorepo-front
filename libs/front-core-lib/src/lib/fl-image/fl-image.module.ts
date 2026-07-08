import { CommonModule } from '@angular/common';
import { inject,NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlMenuDynamicModule } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlDialogModule } from '../fl-dialog/fl-dialog.module';
import { FlInputFileModule } from '../fl-input-file/fl-input-file.module';
import { FlLoaderModule } from '../fl-loader/fl-loader.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlRoundImageComponent } from './component/fl-round-image/fl-round-image.component';
import { FlUpdateImageContainerComponent } from './component/fl-update-image-container/fl-update-image-container.component';
import { FlUploadImageDialogComponent } from './component/fl-upload-image-dialog/fl-upload-image-dialog.component';
import {
  FlImageFullscreenDirective,
  FlImageFullscreenTestComponent,
} from './directive/fl-image-fullscreen/fl-image-fullscreen.directive';
import { FL_IMAGE_I18N } from './fl-image.i18n';

@NgModule({
  declarations: [
    FlRoundImageComponent,
    FlImageFullscreenDirective,
    FlImageFullscreenTestComponent,
    FlUploadImageDialogComponent,
    FlUpdateImageContainerComponent,
  ],
  exports: [
    FlRoundImageComponent,
    FlImageFullscreenDirective,
    FlUploadImageDialogComponent,
    FlUpdateImageContainerComponent,
  ],
  imports: [
    CommonModule,

    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,

    FlDialogModule,
    FlCoreDirectiveModule,
    FlTranslateModule,
    FlLoaderModule,
    FlInputFileModule,
    FlMenuDynamicModule,
  ],
})
export class FlImageModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlImageModule', FL_IMAGE_I18N);
  }
}
