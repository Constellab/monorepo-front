import { CommonModule } from '@angular/common';
import { inject, ModuleWithProviders, NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlDialogModule } from '../fl-dialog/fl-dialog.module';
import { FlLoaderModule } from '../fl-loader/fl-loader.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlAiInputDialogComponent } from './component/fl-ai-input-dialog/fl-ai-input-dialog.component';
import { FlAiMenuButtonComponent } from './component/fl-ai-menu-button/fl-ai-menu-button.component';
import { FlAiVoiceButtonComponent } from './component/fl-ai-voice-button/fl-ai-voice-button.component';
import { FL_AI_I18N } from './i18n/fl-ai.i18n';
import { FlAiService } from './service/fl-ai.service';

@NgModule({
  declarations: [FlAiInputDialogComponent, FlAiMenuButtonComponent, FlAiVoiceButtonComponent],
  exports: [FlAiInputDialogComponent, FlAiMenuButtonComponent, FlAiVoiceButtonComponent],
  imports: [
    CommonModule,
    FormsModule,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,

    FlDialogModule,
    FlLoaderModule,
    FlTranslateModule,
  ],
})
export class FlAiModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlAiModule', FL_AI_I18N);
  }

  static forRoot(aiService: Type<FlAiService>): ModuleWithProviders<FlAiModule> {
    return {
      ngModule: FlAiModule,
      providers: [{ provide: FlAiService, useExisting: aiService }],
    };
  }
}
