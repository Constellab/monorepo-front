import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabRichTextDynamicFieldComponent } from './component/lab-rich-text-dynamic-field/lab-rich-text-dynamic-field.component';
import { LabCoreModule } from '../../lab-core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LabRichTextViewComponent } from './component/lab-rich-text-view/lab-rich-text-view.component';

@NgModule({
  declarations: [LabRichTextDynamicFieldComponent, LabRichTextViewComponent],
  exports: [LabRichTextDynamicFieldComponent, LabRichTextViewComponent],
  imports: [CommonModule, ReactiveFormsModule, LabCoreModule],
})
export class LabRichTextCoreModule {}
