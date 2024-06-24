import { Component } from '@angular/core';
import { RvResourceViewDirective } from '../../model/rv-resource-view.directive';
import { RvResourceViewPlotly } from '../../model/rv-resource-view.class';


@Component({
  selector: 'rv-view-plotly',
  templateUrl: './rv-view-plotly.component.html',
  styleUrls: ['./rv-view-plotly.component.scss']
})
export class RvViewPlotlyComponent extends RvResourceViewDirective<RvResourceViewPlotly> {

}
