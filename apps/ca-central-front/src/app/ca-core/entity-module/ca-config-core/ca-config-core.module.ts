import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CaCoreModule} from '../../ca-core.module';
import {CaCityComponent} from './component/ca-city/ca-city.component';
import {CaSelectOptionsCityComponent} from './component/ca-select-city-options/ca-select-options-city.component';
import {CaCountryFlagPipe} from './pipe/ca-country-flag/ca-country-flag.pipe';


/**
 * Module for config objects (like city, country, etc.)
 */
@NgModule({
  declarations: [
    CaCityComponent,
    CaSelectOptionsCityComponent,
    CaCountryFlagPipe,
  ],
  exports: [
    CaCityComponent,
    CaSelectOptionsCityComponent,
    CaCountryFlagPipe,
  ],
  imports: [
    CommonModule,

    CaCoreModule,
  ]
})
export class CaConfigCoreModule {
}
