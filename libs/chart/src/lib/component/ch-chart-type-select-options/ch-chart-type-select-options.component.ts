import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';

import { ChChartType, chChartTypeIcons } from '../../model/ch-chart.class';

/**
 * Component to place inside a mat-select to add the option of available charts
 */
@Component({
  selector: 'ch-chart-type-select-options',
  templateUrl: './ch-chart-type-select-options.component.html',
  styleUrls: ['./ch-chart-type-select-options.component.scss'],
  standalone: false,
})
export class ChChartTypeSelectOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit
{
  private select: MatSelect;

  @Input() availableChartTypes: ChChartType[];

  chartTypeIcons: Record<ChChartType, string> = chChartTypeIcons;

  constructor() {
    const select = inject(MatSelect, { host: true });

    super(select);

    this.select = select;
  }

  ngOnInit(): void {
    if (this.availableChartTypes == null) {
      this.availableChartTypes = [
        ChChartType.LINE,
        ChChartType.SCATTER_PLOT,
        ChChartType.BAR_PLOT,
        ChChartType.HISTOGRAM,
        ChChartType.STACKED_PLOT,
        ChChartType.BOX_PLOT,
        ChChartType.HEAT_MAP,
        ChChartType.VENN_DIAGRAM,
      ];
    }
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
