import { ChangeDetectionStrategy,Component } from '@angular/core';
import { LiFormSearchComponent } from '@monorepo/lab-lib/li-form';

@Component({
  selector: 'lab-form-search-page',
  template: '<li-form-search class="g-page-search g-mat-table-main-background"></li-form-search>',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LiFormSearchComponent],
})
export class LabFormSearchPageComponent {}
