import { ChangeDetectionStrategy,Component } from '@angular/core';
import { LiFormTemplateSearchComponent } from '@monorepo/lab-lib/li-form';

@Component({
  selector: 'lab-form-template-search-page',
  template:
    '<li-form-template-search class="g-page-search g-mat-table-main-background"></li-form-template-search>',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LiFormTemplateSearchComponent],
})
export class LabFormTemplateSearchPageComponent {}
