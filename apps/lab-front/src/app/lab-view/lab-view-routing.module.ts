import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LabViewSearchPageComponent } from './lab-view-search-page/lab-view-search-page/lab-view-search-page.component';

const routes: Routes = [
  {path: '', component: LabViewSearchPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabViewRoutingModule {
}
