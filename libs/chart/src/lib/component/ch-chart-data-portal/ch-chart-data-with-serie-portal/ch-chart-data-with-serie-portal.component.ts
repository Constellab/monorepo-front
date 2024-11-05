import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ChChartDataWithSerie } from '../../../model/data/ch-chart-serie.class';
import { ChChart2dDatum } from '../../../model/data/ch-chart-data.class';
import { ChChartLabelFormatter } from '../../../model/ch-chart-label-formatter.class';
import { FL_PORTAL_DATA, FlOverlayRef, FlTagColorer } from '@monorepo/front-core-lib';

export interface ChChartDataWithSeriePortalInput {
  data: ChChartDataWithSerie<ChChart2dDatum>;
  color: string;
  tagColorer?: FlTagColorer;
  xLabelFormatter: ChChartLabelFormatter;
  yLabelFormatter: ChChartLabelFormatter;
}

/**
 * Simple portal to show a data with its serie.
 */
@Component({
  selector: 'ch-chart-data-with-serie-portal',
  templateUrl: './ch-chart-data-with-serie-portal.component.html',
  styleUrls: ['./ch-chart-data-with-serie-portal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChChartDataWithSeriePortalComponent {
  data: ChChartDataWithSerie<ChChart2dDatum>;
  color: string;
  tagColorer?: FlTagColorer;

  x: number;
  y: number;

  xLabelFormatter: ChChartLabelFormatter;
  yLabelFormatter: ChChartLabelFormatter;

  constructor(
    @Inject(FL_PORTAL_DATA) input: ChChartDataWithSeriePortalInput,
    private overlayRef: FlOverlayRef
  ) {
    this.data = input.data;
    this.color = input.color;
    this.tagColorer = input.tagColorer;
    this.x = this.data.data.getX();
    this.y = this.data.data.getY();
    this.xLabelFormatter = input.xLabelFormatter;
    this.yLabelFormatter = input.yLabelFormatter;
  }

  closePortal(): void {
    this.overlayRef.dispose();
  }
}
