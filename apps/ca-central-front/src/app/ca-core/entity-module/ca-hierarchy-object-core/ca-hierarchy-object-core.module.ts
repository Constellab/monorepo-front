import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaCoreModule } from '../../ca-core.module';
import {
  CaHierarchyObjectCardComponent
} from './component/ca-hierarchy-object-card/ca-hierarchy-object-card.component';
import {
  CaHierarchyObjectIconComponent
} from './component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import {
  CaHierarchyObjectTableComponent
} from './component/ca-hierarchy-object-table/ca-hierarchy-object-table.component';
import {
  CaHierarchyObjectInlineComponent
} from './component/ca-hierarchy-object-inline/ca-hierarchy-object-inline.component';
import { RouterModule } from '@angular/router';
import { CaNotificationCoreModule } from '../ca-notification-core/ca-notification-core.module';

@NgModule({
  declarations: [
    CaHierarchyObjectCardComponent,
    CaHierarchyObjectIconComponent,
    CaHierarchyObjectTableComponent,
    CaHierarchyObjectInlineComponent
  ],
  exports: [
    CaHierarchyObjectCardComponent,
    CaHierarchyObjectIconComponent,
    CaHierarchyObjectTableComponent,
    CaHierarchyObjectInlineComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    CaCoreModule,
    CaNotificationCoreModule
  ]
})
export class CaHierarchyObjectCoreModule {
}
