import { RouterModule, Routes } from '@angular/router';
import {
  LabScenarioTemplateDetailPageComponent
} from './lab-scenario-template-detail-page/component/lab-scenario-template-detail-page/lab-scenario-template-detail-page.component';
import { NgModule } from '@angular/core';
import {
  LabScenarioTemplatesSearchPageComponent
} from './lab-scenario-templates-search-page/lab-scenario-templates-search-page/lab-scenario-templates-search-page.component';

const routes: Routes = [
  {path: '', component: LabScenarioTemplatesSearchPageComponent},
  {path: ':id', component: LabScenarioTemplateDetailPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabScenarioTemplateRoutingModule {
}
