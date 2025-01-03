import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabCoreModule } from '../../lab-core.module';
import { LabConfigureSpecsFormComponent } from './component/lab-configure-specs-form/lab-configure-specs-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabTagDynamicFieldComponent } from './component/lab-tag-dynamic-field/lab-tag-dynamic-field.component';
import { LabOpenAiCoreModule } from '../lab-open-ai-core/lab-open-ai-core.module';
import { LabCodeEditorDynamicFieldComponent } from './component/lab-code-editor-dynamic-field/lab-code-editor-dynamic-field.component';

@NgModule({
  declarations: [
    LabConfigureSpecsFormComponent,
    LabTagDynamicFieldComponent,
    LabCodeEditorDynamicFieldComponent,
  ],
  exports: [LabConfigureSpecsFormComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LabCoreModule, LabOpenAiCoreModule],
})
export class LabConfigCoreModule {}
