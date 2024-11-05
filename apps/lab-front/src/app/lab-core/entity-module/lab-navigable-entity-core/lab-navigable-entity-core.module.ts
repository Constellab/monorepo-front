import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabNavigableEntityGroupsComponent } from './component/lab-navigable-entity-groups/lab-navigable-entity-groups.component';
import { LabCoreModule } from '../../lab-core.module';
import { RouterLink } from '@angular/router';
import { LabNavigableEntityInlineComponent } from './component/lab-navigable-entity-inline/lab-navigable-entity-inline.component';
import { LabNavigableEntitiesTableComponent } from './component/lab-navigable-entities-table/lab-navigable-entities-table.component';
import { LabNavigableImpactDialogComponent } from './component/lab-navigable-impact-dialog/lab-navigable-impact-dialog.component';

@NgModule({
  declarations: [
    LabNavigableEntityGroupsComponent,
    LabNavigableEntityInlineComponent,
    LabNavigableEntitiesTableComponent,
    LabNavigableImpactDialogComponent,
  ],
  exports: [
    LabNavigableEntityGroupsComponent,
    LabNavigableEntityInlineComponent,
    LabNavigableEntitiesTableComponent,
  ],
  imports: [CommonModule, LabCoreModule, RouterLink],
})
export class LabNavigableEntityCoreModule {}
