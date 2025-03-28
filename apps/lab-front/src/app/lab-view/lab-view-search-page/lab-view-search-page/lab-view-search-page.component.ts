import { Component } from '@angular/core';
import { LiViewConfigSearchComponent } from '@monorepo/lab-lib/li-view-config';

/**
 * Page of the views to search views.
 */
@Component({
  selector: 'lab-views-page',
  templateUrl: './lab-view-search-page.component.html',
  styleUrls: ['./lab-view-search-page.component.scss'],
  imports: [LiViewConfigSearchComponent],
})
export class LabViewSearchPageComponent {}
