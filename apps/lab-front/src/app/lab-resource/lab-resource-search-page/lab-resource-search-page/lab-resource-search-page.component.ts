import { ChangeDetectionStrategy,Component } from '@angular/core';
import { LiResourceSearchComponent } from '@monorepo/lab-lib/li-resource';

/**
 * Page to search and navigate in resources
 */
@Component({
  selector: 'lab-resource-search-page',
  templateUrl: './lab-resource-search-page.component.html',
  styleUrls: ['./lab-resource-search-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LiResourceSearchComponent],
})
export class LabResourceSearchPageComponent {}
