import { Component } from '@angular/core';
import { LabResourceSearchComponent } from '../../../lab-core/entity-module/lab-resource-core/component/lab-resource-search/lab-resource-search.component';

/**
 * Page to search and navigate in resources
 */
@Component({
  selector: 'lab-resource-search-page',
  templateUrl: './lab-resource-search-page.component.html',
  styleUrls: ['./lab-resource-search-page.component.scss'],
  imports: [LabResourceSearchComponent],
})
export class LabResourceSearchPageComponent {}
