import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabScenarioTemplateDetailPageComponent } from './component/lab-scenario-template-detail-page/lab-scenario-template-detail-page.component';
import { LabScenarioTemplateDetailComponent } from './component/lab-scenario-template-detail/lab-scenario-template-detail.component';
import { LabCoreModule } from '../../lab-core/lab-core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabScenarioTemplateDetailHeaderComponent } from './component/lab-scenario-template-detail-header/lab-scenario-template-detail-header.component';
import { LabScenarioTemplateWorkflowComponent } from './component/lab-scenario-template-workflow/lab-scenario-template-workflow.component';
import { LabTagCoreModule } from '../../lab-core/entity-module/lab-tag-core/lab-tag-core.module';

@NgModule({
  declarations: [
    LabScenarioTemplateDetailPageComponent,
    LabScenarioTemplateDetailComponent,
    LabScenarioTemplateDetailHeaderComponent,
    LabScenarioTemplateWorkflowComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LabCoreModule, LabTagCoreModule],
})
export class LabScenarioTemplateDetailPageModule {}
