import { ChangeDetectionStrategy,Component, Input } from '@angular/core';

import { CaCity } from '../../../../model/entities/ca-city.entity';
import { CaCountryFlagPipe } from '../../pipe/ca-country-flag/ca-country-flag.pipe';

@Component({
  selector: 'ca-city',
  templateUrl: './ca-city.component.html',
  styleUrls: ['./ca-city.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CaCountryFlagPipe],
})
export class CaCityComponent {
  @Input() city: CaCity;
}
