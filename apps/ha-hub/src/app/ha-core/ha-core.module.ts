import { NgModule } from '@angular/core';
import { HaCustomLibraryModule } from './ha-custom-library/ha-custom-library.module';
import { HaCustomMaterialModule } from './ha-custom-material/ha-custom-material.module';
import { HaCoreDirectiveModule } from './ha-module/ha-core-directive/ha-core-directive.module';
import { HaCorePipeModule } from './ha-module/ha-core-pipe/ha-core-pipe.module';
import { CommonModule, NgClass } from '@angular/common';

@NgModule({
  exports: [HaCustomLibraryModule, HaCustomMaterialModule, HaCoreDirectiveModule, HaCorePipeModule],
  imports: [NgClass, CommonModule],
})
export class HaCoreModule {}
