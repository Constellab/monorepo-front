import { Component } from '@angular/core';

import { RvResourceViewPlotly } from '../../model/rv-resource-view.class';
import { RvResourceViewDirective } from '../../model/rv-resource-view.directive';

@Component({
  selector: 'rv-view-plotly',
  templateUrl: './rv-view-plotly.component.html',
  styleUrls: ['./rv-view-plotly.component.scss'],
  standalone: false,
})
export class RvViewPlotlyComponent extends RvResourceViewDirective<RvResourceViewPlotly> {}
