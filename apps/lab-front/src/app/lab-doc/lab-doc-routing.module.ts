import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LabTechnicalDocPageComponent} from './component/lab-technical-doc-page/lab-technical-doc-page.component';

const routes: Routes = [
  {path: 'technical-doc/:typingName', component: LabTechnicalDocPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabDocRoutingModule {
}
