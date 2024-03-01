import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {TranslateModule} from '@ngx-translate/core';
import {FlCoreDirectiveModule, FlCorePipeModule, FlInputFileModule} from '@monorepo/front-core-lib';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {HaDocFileDialogComponent} from './ha-doc-file-dialog/ha-doc-file-dialog.component';
import {HaCoreModule} from '../../../ha-core/ha-core.module';
import {MatTooltipModule} from '@angular/material/tooltip';


@NgModule({
  declarations: [HaDocFileDialogComponent],
  exports: [HaDocFileDialogComponent],
  imports: [
    CommonModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule,
    FlCorePipeModule,
    ReactiveFormsModule,
    MatInputModule,
    FlCoreDirectiveModule,
    HaCoreModule,
    FlInputFileModule,
    MatTooltipModule
  ]
})
export class HaPublicCoreModule {
}
