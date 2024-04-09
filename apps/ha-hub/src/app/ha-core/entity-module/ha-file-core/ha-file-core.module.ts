import {NgModule} from '@angular/core';
import {HaFileDialogComponent} from './component/ha-file-dialog/ha-file-dialog.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HaCoreModule} from '../../ha-core.module';

@NgModule({
  declarations: [HaFileDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HaCoreModule,
  ],
  providers: [],
  exports: []
})
export class HaFileCoreModule {
}
