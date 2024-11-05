import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabActivityTableComponent } from './component/lab-activity-table/lab-activity-table.component';
import { LabActivitySearchComponent } from './component/lab-activity-search/lab-activity-search.component';
import { LabActivitySearchFormComponent } from './component/lab-activity-search-form/lab-activity-search-form.component';
import { LabCoreModule } from '../../lab-core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LabActivityTableComponent, LabActivitySearchComponent, LabActivitySearchFormComponent],
  exports: [LabActivityTableComponent, LabActivitySearchComponent, LabActivitySearchFormComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, LabCoreModule],
})
export class LabActivityCoreModule {}
