import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LabRichTextDynamicFieldComponent} from './component/lab-rich-text-dynamic-field.component';
import {LabCoreModule} from '../../lab-core.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    LabRichTextDynamicFieldComponent
  ],
  exports: [
    LabRichTextDynamicFieldComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    LabCoreModule,
  ],
})
export class LabRichTextCoreModule {}
