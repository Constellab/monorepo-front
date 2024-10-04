import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  LabScenariosListPageComponent
} from './lab-scenarios-page/lab-scenarios-page-list/lab-scenarios-list-page.component';
import {
  LabScenarioDetailPageComponent
} from './lab-scenario-detail-page/component/lab-scenario-detail-page/lab-scenario-detail-page.component';

const routes: Routes = [
  {path: '', component: LabScenariosListPageComponent},
  {path: ':id', component: LabScenarioDetailPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabScenarioRoutingModule {
}
