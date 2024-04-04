import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LabTechnicalDocPageComponent} from './component/lab-technical-doc-page/lab-technical-doc-page.component';
import {LabDocRoutingModule} from './lab-doc-routing.module';
import {LabCoreModule} from '../lab-core/lab-core.module';
import {LabTypeCoreModule} from '../lab-core/entity-module/lab-type-core/lab-type-core.module';

@NgModule({
  declarations: [
    LabTechnicalDocPageComponent
  ],
  imports: [
    CommonModule,
    LabCoreModule,
    LabTypeCoreModule,

    LabDocRoutingModule,
  ]
})
export class LabDocModule {
}
