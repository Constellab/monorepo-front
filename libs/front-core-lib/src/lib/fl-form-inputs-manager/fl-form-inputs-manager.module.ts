import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';

import { FlTextIconModule } from '../fl-text-icon/fl-text-icon.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlFormInputsManagerComponent } from './fl-form-inputs-manager/fl-form-inputs-manager.component';

@NgModule({
  declarations: [FlFormInputsManagerComponent],
  exports: [FlFormInputsManagerComponent],
  imports: [CommonModule, MatIconModule, FlTranslateModule, FlCoreComponentModule, FlTextIconModule],
})
export class FlFormInputsManagerModule {}
