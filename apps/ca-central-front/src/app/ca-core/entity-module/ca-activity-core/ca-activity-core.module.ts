import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CaActivitySearchComponent} from './component/ca-activity-search/ca-activity-search.component';
import {CaActivitySearchFormComponent} from './component/ca-activity-search-form/ca-activity-search-form.component';
import {CaActivityTableComponent} from './component/ca-activity-table/ca-activity-table.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CaCoreModule} from '../../ca-core.module';
import {CaSpaceCoreModule} from '../ca-space-core/ca-space-core.module';

@NgModule({
  declarations: [
    CaActivitySearchComponent,
    CaActivitySearchFormComponent,
    CaActivityTableComponent,
  ],
  exports: [
    CaActivitySearchComponent,
    CaActivityTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CaCoreModule,
    CaSpaceCoreModule,
  ],
})
export class CaActivityCoreModule {
}
