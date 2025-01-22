import { Component } from '@angular/core';
import { LabViewConfigSearchComponent } from '../../../lab-core/entity-module/lab-view-config-core/component/lab-view-config-search/lab-view-config-search.component';

/**
 * Page of the views to search views.
 */
@Component({
  selector: 'lab-views-page',
  templateUrl: './lab-view-search-page.component.html',
  styleUrls: ['./lab-view-search-page.component.scss'],
  imports: [LabViewConfigSearchComponent],
})
export class LabViewSearchPageComponent {}
