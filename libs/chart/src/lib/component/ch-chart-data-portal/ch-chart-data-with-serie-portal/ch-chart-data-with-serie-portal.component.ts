import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FL_PORTAL_DATA, FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';
import { FlTagColorer } from '@monorepo/front-core-lib/fl-tag';

import { ChChartLabelFormatter } from '../../../model/ch-chart-label-formatter.class';
import { ChChart2dDatum } from '../../../model/data/ch-chart-data.class';
import { ChChartDataWithSerie } from '../../../model/data/ch-chart-serie.class';

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
  standalone: false,
})
export class ChChartDataWithSeriePortalComponent {
  private overlayRef = inject(FlOverlayRef);

  data: ChChartDataWithSerie<ChChart2dDatum>;
  color: string;
  tagColorer?: FlTagColorer;

  x: number;
  y: number;

  xLabelFormatter: ChChartLabelFormatter;
  yLabelFormatter: ChChartLabelFormatter;

  constructor() {
    const input = inject<ChChartDataWithSeriePortalInput>(FL_PORTAL_DATA);

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
