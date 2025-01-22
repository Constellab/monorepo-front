import { Component } from '@angular/core';
import { CaLabSearchComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-search/ca-lab-search.component';

@Component({
  selector: 'ca-current-space-labs-page',
  templateUrl: './ca-current-space-labs-page.component.html',
  styleUrls: ['./ca-current-space-labs-page.component.scss'],
  imports: [CaLabSearchComponent],
})
export class CaCurrentSpaceLabsPageComponent {}
