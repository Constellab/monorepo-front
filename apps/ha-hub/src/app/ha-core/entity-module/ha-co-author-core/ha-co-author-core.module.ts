import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HaCoreModule} from '../../ha-core.module';
import {HaCoAuthorDialogComponent} from './component/ha-co-author-dialog/ha-co-author-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [HaCoAuthorDialogComponent],
  exports: [HaCoAuthorDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HaCoreModule
  ]
})
export class HaCoAuthorCoreModule {
}
