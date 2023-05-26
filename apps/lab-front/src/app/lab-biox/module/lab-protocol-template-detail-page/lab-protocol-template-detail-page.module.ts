import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  LabProtocolTemplateDetailPageComponent
} from './component/lab-protocol-template-detail-page/lab-protocol-template-detail-page.component';
import {
  LabProtocolTemplateDetailComponent
} from './component/lab-protocol-template-detail/lab-protocol-template-detail.component';
import {LabCoreModule} from '../../../lab-core/lab-core.module';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    LabProtocolTemplateDetailPageComponent,
    LabProtocolTemplateDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    LabCoreModule,
  ]
})
export class LabProtocolTemplateDetailPageModule {
}
