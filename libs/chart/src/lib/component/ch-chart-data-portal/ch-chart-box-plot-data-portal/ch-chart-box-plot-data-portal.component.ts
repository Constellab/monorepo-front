import { Component, Inject, ViewChild } from '@angular/core';
import { ChChartBoxPlotData } from '../../../model/data/ch-chart-box-plot-data.class';
import { ChChartDataWithSerie } from '../../../model/data/ch-chart-serie.class';
import { MatMenuTrigger } from '@angular/material/menu';
import { FL_PORTAL_DATA, FlTagColorer } from '@monorepo/front-core-lib';

export interface ChChartBoxPlotDataPortalInput {
  data: ChChartDataWithSerie<ChChartBoxPlotData>;
  color: string;
  tagColorer: FlTagColorer;
}

/**
 * Display the box plot data in a portal
 */
@Component({
  selector: 'ch-chart-box-plot-data-portal',
  templateUrl: './ch-chart-box-plot-data-portal.component.html',
  styleUrls: ['./ch-chart-box-plot-data-portal.component.scss'],
})
export class ChChartBoxPlotDataPortalComponent {
  data: ChChartDataWithSerie<ChChartBoxPlotData>;

  color: string;

  boxPlotData: ChChartBoxPlotData;

  tagColorer?: FlTagColorer;
  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger;

  constructor(@Inject(FL_PORTAL_DATA) input: ChChartBoxPlotDataPortalInput) {
    this.data = input.data;
    this.boxPlotData = input.data.data;
    this.color = input.color;
    this.tagColorer = input.tagColorer;
  }
}
