import { Component, inject } from '@angular/core';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { CaLabUsageComponent } from '../ca-lab-usage/ca-lab-usage.component';

@Component({
  selector: 'ca-lab-usage-page',
  templateUrl: './ca-lab-usage-page.component.html',
  styleUrls: ['./ca-lab-usage-page.component.scss'],
  imports: [CaLabUsageComponent],
})
export class CaLabUsagePageComponent {
  id = inject(CaLabDetailPageState).getLabId();
  isCloud$ = inject(CaLabDetailPageState).isCloud$();
}
