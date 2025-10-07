import { Component } from '@angular/core';

import { HaFooterComponent } from '../../ha-core/ha-component/ha-footer/ha-footer/ha-footer.component';
import { HaHeaderComponent } from '../../ha-core/ha-component/ha-header/ha-header/ha-header.component';
import { Ha404Component } from '../ha-404/ha-404.component';

@Component({
  selector: 'ha-404-page',
  templateUrl: './ha-404-page.component.html',
  styleUrls: ['./ha-404-page.component.scss'],
  imports: [HaHeaderComponent, HaFooterComponent, Ha404Component],
})
export class Ha404PageComponent {}
