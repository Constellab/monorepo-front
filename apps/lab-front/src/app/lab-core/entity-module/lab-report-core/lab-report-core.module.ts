import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LabCoreModule} from '../../lab-core.module';
import {LabReportSearchComponent} from './component/lab-report-search/lab-report-search.component';
import {LabReportSearchFormComponent} from './component/lab-report-search-form/lab-report-search-form.component';
import {LabReportTableComponent} from './component/lab-report-table/lab-report-table.component';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LabReportFormDialogComponent} from './component/lab-report-form-dialog/lab-report-form-dialog.component';
import {LabSelectReportDialogComponent} from './component/lab-select-report-dialog/lab-select-report-dialog.component';
import {LabEntityCoreModule} from '../lab-entity-core/lab-entity-core.module';
import {LabProjectCoreModule} from '../lab-project-core/lab-project-core.module';
import {LabSelectReportComponent} from './component/lab-select-report/lab-select-report.component';
import {LabReportInlineComponent} from './component/lab-report-inline/lab-report-inline.component';
import {LabReportTemplateCoreModule} from '../lab-report-template-core/lab-report-template-core.module';

@NgModule({
  declarations: [
    LabReportSearchComponent,
    LabReportSearchFormComponent,
    LabReportTableComponent,
    LabReportFormDialogComponent,
    LabSelectReportDialogComponent,
    LabSelectReportComponent,
    LabReportInlineComponent,
  ],
  exports: [
    LabReportSearchComponent,
    LabReportSearchFormComponent,
    LabReportTableComponent,
    LabReportFormDialogComponent,
    LabSelectReportDialogComponent,
    LabSelectReportComponent,
    LabReportInlineComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,

    LabCoreModule,
    LabEntityCoreModule,
    LabProjectCoreModule,
    LabReportTemplateCoreModule,
  ],
})
export class LabReportCoreModule {
}
