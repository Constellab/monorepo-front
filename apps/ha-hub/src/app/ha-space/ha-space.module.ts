import { NgModule } from '@angular/core';
import { HaSelectableSpaceListComponent } from './module/ha-selectable-space-list/ha-selectable-space-list.component';
import { HaCoreModule } from '../ha-core/ha-core.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [HaSelectableSpaceListComponent],
  exports: [HaSelectableSpaceListComponent],
  imports: [CommonModule, HaCoreModule],
})
export class HaSpaceModule {}
