import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LabCoreModule} from '../../lab-core.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LabProjectSelectComponent} from './component/lab-project-select/lab-project-select.component';
import {LabProjectInlineComponent} from './component/lab-project-inline/lab-project-inline.component';
import {
  LabProjectSelectPortalComponent
} from './component/lab-project-select-portal/lab-project-select-portal.component';
import {
  LabProjectInlineSelectComponent
} from './component/lab-project-inline-select/lab-project-inline-select.component';

@NgModule({
  declarations: [
    LabProjectSelectComponent,
    LabProjectInlineComponent,
    LabProjectSelectPortalComponent,
    LabProjectInlineSelectComponent,
  ],
  exports: [
    LabProjectSelectComponent,
    LabProjectInlineComponent,
    LabProjectSelectPortalComponent,
    LabProjectInlineSelectComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    LabCoreModule
  ],
})
export class LabProjectCoreModule {
}
