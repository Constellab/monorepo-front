import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlRoundImageComponent } from './component/fl-round-image/fl-round-image.component';
import {
  FlImageFullscreenDirective,
  FlImageFullscreenTestComponent,
} from './directive/fl-image-fullscreen/fl-image-fullscreen.directive';
import { FlDialogModule } from '../fl-dialog/fl-dialog.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FlCoreDirectiveModule } from '../fl-core-directive/fl-core-directive.module';
import { FlUploadImageDialogComponent } from './component/fl-upload-image-dialog/fl-upload-image-dialog.component';
import { FlLoaderModule } from '../fl-loader/fl-loader.module';
import { FlTranslateService } from '../fl-translate/service/fl-translate.service';
import { flImageI18n } from './fl-image.i18n';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlUpdateImageContainerComponent } from './component/fl-update-image-container/fl-update-image-container.component';
import { FlInputFileModule } from '../fl-input-file/fl-input-file.module';
import { MatDividerModule } from '@angular/material/divider';
import { FlMenuDynamicModule } from '../fl-menu-dynamic/fl-menu-dynamic.module';

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

    translateService.addModuleTranslation('FlImageModule', flImageI18n);
  }
}
