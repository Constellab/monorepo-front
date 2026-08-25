import { axisBottom, axisLeft, axisRight, axisTop, Numeric } from 'd3';
import { Axis, AxisScale } from 'd3-axis';
import { Selection } from 'd3-selection';

import { ChChartLabelFormatFunction, ChChartLabelFormatter } from '../ch-chart-label-formatter.class';
import { ChD3SelectionSimple } from '../ch-d3.class';
import { ChChartScale, ChChartScaleBand } from '../scale/ch-chart-scale.class';

/**
 * The type define the position of the axis
 */
export type ChChartAxisType = 'left' | 'bottom' | 'right' | 'top';

export class ChChartAxis {
  // height needed for 1 char of the x tick label rotated
  private static readonly xRotateRequiredHeightPerChar: number = 5;
  // width needed for 1 char of the y tick label
  private static readonly yRequiredWidthPerChar: number = 6;
  // maximum nb of char for a tick label
  protected static readonly maxTickLabelLength: number = 25;

  public static readonly axisLabelFontSize: number = 10;
  public static readonly tickLabelPadding: number = 15;

  public scale: ChChartScale;

  public axisContainer: Selection<any, void, null, undefined>;

  protected readonly type: ChChartAxisType;

  protected zoomDuration: number = 250;

  protected tickTextIsRotated: boolean = false;

  protected label: string | null | undefined;

  private tickFormatter: ChChartLabelFormatter | null;

  constructor(type: ChChartAxisType) {
    this.type = type;
  }

  public setScale(scale: ChChartScale): this {
    this.scale = scale.nice();
    return this;
  }

  public setTickFormatter(tickFormatter: ChChartLabelFormatter | null): this {
    if (tickFormatter) {
      this.tickFormatter = tickFormatter;
    }
    return this;
  }

  public getTickFormatter(): ChChartLabelFormatter {
    return this.tickFormatter ?? ChChartLabelFormatter.getDefaultTickLabel();
  }

  public setZoomDuration(duration: number): this {
    this.zoomDuration = duration;
    return this;
  }

  public rotateTickText(): this {
    this.tickTextIsRotated = true;
    return this;
  }

  public draw(parent: Selection<any, void, null, undefined>, chartHeight: number, chartWidth: number): void {
    this.axisContainer = parent
      .append('g')
      .attr('transform', this.getAxisTransform(chartHeight, chartWidth))
      .call(this.createAxis());

    this.drawAxisLabel();
    this.refreshTickLabels();
  }

  // draw the axis label
  private drawAxisLabel(): void {
    if (this.label) {
      let x: number | null = null;
      let y: number | null = null;
      let transform: string | null = null;
      if (this.type === 'left') {
        x = -(this.axisContainer.node().getBBox().height / 2);
        y = -this.getTickLabelSize();
        // write text vertically
        transform = 'translate(0)rotate(270)';
      } else if (this.type === 'bottom') {
        x = this.axisContainer.node().getBBox().width / 2;
        y = this.getTickLabelSize();
      }
      // on top of the axis, centered
      this.axisContainer
        .append('text')
        .text(this.label)
        .attr('x', x)
        .attr('y', y)
        .attr('fill', 'currentcolor')
        .attr('text-anchor', 'middle')
        .style('font-size', ChChartAxis.axisLabelFontSize + 'px')
        .attr('transform', transform)
        .append('title')
        .text(this.label);
    }
  }

  public setLabel(label: string | null | undefined): this {
    this.label = label;
    return this;
  }

  public getSize(): number {
    // width of the tick labels + the width of the label
    return this.getTickLabelSize() + (this.label ? ChChartAxis.axisLabelFontSize : 0);
  }

  private getTickLabelSize(): number {
    const charSize =
      this.type === 'left' ? ChChartAxis.yRequiredWidthPerChar : ChChartAxis.xRotateRequiredHeightPerChar;

    const maxLabelLength = Math.min(
      this.getTickFormatter().shortFormatMaxLength,
      ChChartAxis.maxTickLabelLength
    );
    // calculate size of the text + padding
    return maxLabelLength * charSize + ChChartAxis.tickLabelPadding;
  }

  /**
   * function to Rotate the tick labels and add a title to the label
   * Need to be called each time the zoom is changed
   * @private
   */
  private refreshTickLabels(): void {
    this.refreshTickTextRotation();
    this.refreshTickTitle();
  }

  private refreshTickTextRotation(): void {
    if (this.tickTextIsRotated) {
      this.getTickTextSelection()
        // rotate the text of the legend
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end');
    }
  }

  private refreshTickTitle(): void {
    const tickFormatter = this.getTickFormatter();
    // add title to tick (only if a tick format exist)
    this.getTickTextSelection()
      // add a title to each tick
      .append('title')
      .text((d) => tickFormatter.formatLong(d));
  }

  private getTickTextSelection(): ChD3SelectionSimple {
    return this.axisContainer.selectAll('.tick').selectAll('text');
  }

  private createAxis(): Axis<Numeric> {
    const axis: Axis<Numeric> = this.getAxisFactory()(this.scale.d3Scale);

    // set the tick method if exists
    const tickFormat = this.getTickFormatter();
    // set the tick format method and limit length of tick
    axis.tickFormat(
      // d3 renders an empty tick label for a null text
      (d, index) => tickFormat.formatShort(d.valueOf(), index, ChChartAxis.maxTickLabelLength) ?? ''
    );

    return axis;
  }

  private getAxisFactory(): (scale: AxisScale<Numeric>) => Axis<Numeric> {
    switch (this.type) {
      case 'left':
        return axisLeft;
      case 'bottom':
        return axisBottom;
      case 'right':
        return axisRight;
      case 'top':
        return axisTop;
    }
  }

  /**
   * Get the transform to position the axis base on axis type
   * @param chartHeight
   * @param chartWidth
   * @private
   */
  private getAxisTransform(chartHeight: number, chartWidth: number): string {
    switch (this.type) {
      case 'left':
        return 'translate(0,0)';
      case 'bottom':
        return 'translate(0,' + chartHeight + ')';
      case 'right':
        return 'translate(' + chartWidth + ',0)';
      case 'top':
        return 'translate(0,0)';
    }
  }

  ///////////////////////////////// ZOOM ////////////////////////////////

  public zoom(from: number, to: number): void {
    if (from == null || to == null || isNaN(from) || isNaN(to)) {
      return;
    }

    // update x scale domain
    this.scale.zoom(from, to);

    // Update axis
    this.refreshAxis();
  }

  public resetZoom(): void {
    // reset the scale
    this.scale.resetZoom();
    this.scale.nice();
    this.refreshAxis();
  }

  private refreshAxis(): void {
    // recreate the axis
    this.axisContainer
      .transition()
      .duration(this.zoomDuration)
      .call(this.createAxis())
      // wait for the end of transition to add the tick title otherwise it is overwritten
      .on('end', () => this.refreshTickTitle());
    // directly rotate the text, this is not overwritten
    this.refreshTickTextRotation();
  }
}

/**
 * Specific axis manager for the axis that use a scale band
 */
export class ChChartAxisBand extends ChChartAxis {
  // width of 1 character in tick
  public static readonly tickCharacterWidth: number = 5;
  // width needed by the tick in X when the text is rotated to prevent superposition
  public static readonly tickXRotateWidth: number = ChChartAxisBand.tickCharacterWidth * 3;

  public scale: ChChartScaleBand;

  public setScale(scale: ChChartScaleBand): this {
    return super.setScale(scale);
  }

  /**
   * Configure a smart tick format, it prevents the tick text to get on top of each other
   * It checks the bandwidth and compare it with the tick size to decide which tick text to show
   *
   * @param tickSize average size of the tick in px
   * @param tickFormat
   */
  public setSmartTickFormat(tickSize: number, tickFormat: ChChartLabelFormatter | null = null): this {
    if (tickFormat == null) {
      tickFormat = new ChChartLabelFormatter((d) => d?.toString() ?? null, ChChartAxis.maxTickLabelLength);
    }

    const format: ChChartLabelFormatFunction = (d, index) => {
      const bandWidth: number = this.scale.bandwidth();

      // calculate the tick interval
      const tickInterval: number = Math.ceil(tickSize / bandWidth);

      // for each tick interval modulo, display the tick, otherwise show an empty string
      return (index ?? 0) % tickInterval === 0 ? tickFormat.formatShort(d, index) : null;
    };

    const smartTickFormat = new ChChartLabelFormatter(format, tickFormat.shortFormatMaxLength);
    this.setTickFormatter(smartTickFormat);

    return this;
  }
}
