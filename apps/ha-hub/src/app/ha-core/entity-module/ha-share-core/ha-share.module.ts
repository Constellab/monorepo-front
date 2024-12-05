import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HaCoreModule } from '../../ha-core.module';
import { HaShareButtonComponent } from './component/ha-share-button/ha-share-button.component';

@NgModule({
  declarations: [HaShareButtonComponent],
  exports: [HaShareButtonComponent],
  imports: [CommonModule, HaCoreModule],
})
export class HaShareCoreModule {}
