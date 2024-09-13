import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {CaCoreModule} from '../../../ca-core/ca-core.module';
import {CaSyncObjectInfoComponent} from './component/ca-sync-object-info/ca-sync-object-info.component';
import {CaValidatedObjectInfoComponent} from './component/ca-validated-object-info/ca-validated-object-info.component';
import {
  CaHierarchyObjectBreadcrumbComponent
} from './component/ca-hierarchy-object-breadcrumb/ca-hierarchy-object-breadcrumb.component';
import {CaHierarchyObjectQueryParamsPipe} from './pipe/ca-hierarchy-object-query-params.pipe';

/**
 * Module that contains components for the folder, experiment and report objects
 */
@NgModule({
  declarations: [
    CaSyncObjectInfoComponent,
    CaValidatedObjectInfoComponent,
    CaHierarchyObjectBreadcrumbComponent,
    CaHierarchyObjectQueryParamsPipe,
  ],
  exports: [
    CaSyncObjectInfoComponent,
    CaValidatedObjectInfoComponent,
    CaHierarchyObjectBreadcrumbComponent,
    CaHierarchyObjectQueryParamsPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,

    CaCoreModule,
  ]
})
export class CaFolderHierarchyCoreModule {
}
