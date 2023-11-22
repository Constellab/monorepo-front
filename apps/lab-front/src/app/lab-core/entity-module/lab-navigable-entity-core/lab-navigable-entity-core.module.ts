import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  LabNavigableEntityGroupsComponent
} from './component/lab-navigable-entity-groups/lab-navigable-entity-groups.component';
import {LabCoreModule} from '../../lab-core.module';
import {RouterLink} from '@angular/router';

@NgModule({
  declarations: [LabNavigableEntityGroupsComponent],
  exports: [LabNavigableEntityGroupsComponent],
  imports: [
    CommonModule,

    LabCoreModule,
    RouterLink,
  ],
})
export class LabNavigableEntityCoreModule {
}
