import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LabSelectCredentialsComponent} from './component/lab-select-credentials/lab-select-credentials.component';
import {
  LabCredentialsFormDialogComponent
} from './component/lab-credentials-form-dialog/lab-credentials-form-dialog.component';
import {LabCredentialsTableComponent} from './component/lab-credentials-table/lab-credentials-table.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LabCoreModule} from '../../lab-core.module';
import {LabCredentialsInlineComponent} from './component/lab-credentials-inline/lab-credentials-inline.component';
import {
  LabSelectCredentialsDynamicFieldComponent
} from './component/lab-select-credentials-dynamic-field/lab-select-credentials-dynamic-field.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    LabSelectCredentialsComponent,
    LabCredentialsFormDialogComponent,
    LabCredentialsTableComponent,
    LabCredentialsInlineComponent,
    LabSelectCredentialsDynamicFieldComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    LabCoreModule,
  ],
  exports: [
    LabCredentialsTableComponent,
    LabSelectCredentialsDynamicFieldComponent,
  ],
})
export class LabCredentialsCoreModule {
}
