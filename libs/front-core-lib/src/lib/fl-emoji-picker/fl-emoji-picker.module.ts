import { CommonModule } from '@angular/common';
import { inject,NgModule } from '@angular/core';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlCorePipeModule } from '../fl-core-pipe/fl-core-pipe.module';
import { FlPortalModule } from '../fl-portal/fl-portal.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlEmojiPickerPortalComponent } from './component/fl-emoji-picker-portal/fl-emoji-picker-portal.component';
import { FL_EMOJI_I18N } from './fl-emoji-picker.i18n';

@NgModule({
  imports: [CommonModule, FlPortalModule, FlInfiniteScrollModule, FlCorePipeModule, FlTranslateModule],
  exports: [FlEmojiPickerPortalComponent],
  declarations: [FlEmojiPickerPortalComponent],
})
export class FlEmojiPickerModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlEmojiPickerModule', FL_EMOJI_I18N);
  }
}
