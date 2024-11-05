import { NgModule } from '@angular/core';
import { FlEmojiPickerPortalComponent } from './component/fl-emoji-picker-portal/fl-emoji-picker-portal.component';
import { FlPortalModule } from '../fl-portal/fl-portal.module';
import { CommonModule } from '@angular/common';
import { FlInfiniteScrollModule } from '../fl-inifite-scroll/fl-infinite-scroll.module';
import { FlCorePipeModule } from '../fl-core-pipe/fl-core-pipe.module';
import { FlTranslateService } from '../fl-translate/service/fl-translate.service';
import { flEmojiI18n } from './component/fl-emoji-picker.i18n';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';

@NgModule({
  imports: [CommonModule, FlPortalModule, FlInfiniteScrollModule, FlCorePipeModule, FlTranslateModule],
  exports: [FlEmojiPickerPortalComponent],
  declarations: [FlEmojiPickerPortalComponent],
})
export class FlEmojiPickerModule {
  constructor(translateService: FlTranslateService) {
    translateService.addModuleTranslation('FlEmojiPickerModule', flEmojiI18n);
  }
}
