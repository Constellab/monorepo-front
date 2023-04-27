import {ChChart2dDatum} from '../model/data/ch-chart-data.class';
import {line} from 'd3';
import {ChChart2AxisRenderer} from './ch-chart-renderer.class';
import {ChChartScale} from '../model/scale/ch-chart-scale.class';
import {ValueFn} from 'd3-selection';
import {ChChartSerie} from '../model/data/ch-chart-serie.class';
import {ChChart2dMultiSerie} from '../model/data/ch-chart-multi-serie.class';
import {ChChartScaleColor} from '../model/scale/ch-chart-scale-color.class';


/**
 * Class to manage line chart with multiple series
 */
export class ChChartRendererLinePlot extends ChChart2AxisRenderer<ChChart2dMultiSerie<ChChart2dDatum>> {

  private readonly serieClassName: string = 'serie';

  constructor(public colorScale: ChChartScaleColor) {
    super();
  }

  renderFirst(): void {
    this.data.container
      .selectAll()
      .data(this.data.data.series)
      .enter()
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', serie => this.colorScale.scale(serie.key))
      .attr('class', this.serieClassName)  // I add the class line to be able to modify this line later on.
      .attr('stroke-width', 1.5)
      .attr('d', this.getDValue(this.data.xAxis.scale, this.data.yAxis.scale)
      );
  }

  refreshRender(): void {
    this.data.container
      .selectAll(`.${this.serieClassName}`)
      .transition()
      .attr('d', this.getDValue(this.data.xAxis.scale, this.data.yAxis.scale));
  }

  private getDValue(xScale: ChChartScale,
                    yScale: ChChartScale): ValueFn<any, ChChartSerie<ChChart2dDatum>, any> {
    return (d: ChChartSerie<ChChart2dDatum>) => line<ChChart2dDatum>()
      .x((d: ChChart2dDatum) => xScale.scale(d.getX()))
      .y((d: ChChart2dDatum) => yScale.scale(d.getY()))
      (d.getValidData()); // use to loop through serie's data
  }
}
