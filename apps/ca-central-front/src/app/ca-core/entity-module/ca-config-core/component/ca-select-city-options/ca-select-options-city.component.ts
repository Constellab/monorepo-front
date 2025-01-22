import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib';
import { CaCountry } from '../../../../model/entities/ca-country.entity';
import { CaCountryService } from '../../../../service-api/ca-country.service';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'ca-select-city-options',
  templateUrl: './ca-select-options-city.component.html',
  styleUrls: ['./ca-select-options-city.component.scss'],
  standalone: false,
})
export class CaSelectOptionsCityComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit
{
  private countryService = inject(CaCountryService);
  private select: MatSelect;

  countries: CaCountry[];

  isLoading: boolean = false;

  constructor() {
    const select = inject(MatSelect, { host: true });

    super(select);

    this.select = select;
  }

  ngOnInit(): void {
    this.overrideCompareWithOnIds(this.select);
    this.getCountries();
  }

  private getCountries(): void {
    this.isLoading = true;
    this.countryService.get().subscribe(
      (countries) => this.getCountriesSuccess(countries),
      () => (this.isLoading = false)
    );
  }

  private getCountriesSuccess(countries: CaCountry[]): void {
    this.isLoading = false;
    this.countries = countries;
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
