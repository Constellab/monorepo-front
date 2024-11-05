import { Component, Input } from '@angular/core';
import { FlArrayObs } from '@monorepo/front-core-lib';
import { CaLabVolumePeriod } from '../../../../ca-core/model/entities/lab/ca-lab-stats.dto';

@Component({
  selector: 'ca-lab-volume-price-table',
  templateUrl: './ca-lab-volume-price-table.component.html',
  styleUrl: './ca-lab-volume-price-table.component.scss',
})
export class CaLabVolumePriceTableComponent {
  @Input() datasource: FlArrayObs<CaLabVolumePeriod>;

  @Input() columns: string[] = ['dates', 'volume', 'volumePricePerGBPerHour', 'volumePrice'];
}
