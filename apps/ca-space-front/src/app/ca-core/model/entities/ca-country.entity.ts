import { Type } from 'class-transformer';

import { CaCity } from './ca-city.entity';

export class CaCountry {
  id: string;

  name: string;

  shortName: string;

  @Type(() => CaCity)
  cities: CaCity[];
}
