import { Component, inject } from '@angular/core';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { CaLabUsageComponent } from '../ca-lab-usage/ca-lab-usage.component';
import { AsyncPipe } from '@angular/common';
import { CaLabFreeCardInfoComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-free-card-info/ca-lab-free-card-info.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ca-lab-usage-page',
  templateUrl: './ca-lab-usage-page.component.html',
  styleUrls: ['./ca-lab-usage-page.component.scss'],
  imports: [CaLabUsageComponent, AsyncPipe, CaLabFreeCardInfoComponent],
})
export class CaLabUsagePageComponent {
  id = inject(CaLabDetailPageState).getLabId();
  isFreeLab$ = inject(CaLabDetailPageState).isFreeLab$();
  showPrice$ = inject(CaLabDetailPageState)
    .getLab$()
    .pipe(map((lab) => lab.typeObj.isCloud && !lab.isFreeLab));
}
