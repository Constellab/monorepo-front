import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  CaAuthenticatedUserInlineComponent
} from './component/ca-authenticated-user-inline/ca-authenticated-user-inline.component';
import {CaUserTableComponent} from './component/ca-user-table/ca-user-table.component';
import {CaUserListInlineComponent} from './component/ca-user-list-inline/ca-user-list-inline.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {CaUserSearchComponent} from './component/ca-user-search/ca-user-search.component';
import {CaUserSearchFormComponent} from './component/ca-user-search-form/ca-user-search-form.component';
import {CaCoreModule} from '../../ca-core.module';

/**
 * Module containing users component
 */
@NgModule({
  declarations: [
    CaAuthenticatedUserInlineComponent,
    CaUserTableComponent,
    CaUserListInlineComponent,
    CaUserSearchComponent,
    CaUserSearchFormComponent,
  ],
  exports: [
    CaAuthenticatedUserInlineComponent,
    CaUserTableComponent,
    CaUserListInlineComponent,
    CaUserSearchComponent,
    CaUserSearchFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CaCoreModule,
    RouterModule,
  ]
})
export class CaUserCoreModule {
}
