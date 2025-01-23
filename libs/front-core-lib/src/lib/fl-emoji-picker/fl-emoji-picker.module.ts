import { NgModule, inject } from '@angular/core';
import { FlEmojiPickerPortalComponent } from './component/fl-emoji-picker-portal/fl-emoji-picker-portal.component';
import { FlPortalModule } from '../fl-portal/fl-portal.module';
import { CommonModule } from '@angular/common';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlCorePipeModule } from '../fl-core-pipe/fl-core-pipe.module';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { flEmojiI18n } from './fl-emoji-picker.i18n';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';

@NgModule({
  imports: [CommonModule, FlPortalModule, FlInfiniteScrollModule, FlCorePipeModule, FlTranslateModule],
  exports: [FlEmojiPickerPortalComponent],
  declarations: [FlEmojiPickerPortalComponent],
})
export class FlEmojiPickerModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlEmojiPickerModule', flEmojiI18n);
  }
}
