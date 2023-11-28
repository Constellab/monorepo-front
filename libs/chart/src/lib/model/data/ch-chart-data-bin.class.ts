// data holder for the histogram
import {ChChart2dDatum} from './ch-chart-data.class';
import {ChChartDomain} from '../ch-chart-domain.class';
import {ChChartLabelFormatter} from '../ch-chart-label-formatter.class';

/**
 * Binned data, this is an object that contains multiple value between the min and max values
 *
 * Useful for histogram
 */
export class ChChartDataBin extends ChChart2dDatum {

  constructor(x: number, y: number,
              public readonly min: number, public readonly max: number) {
    super(x, y);
  }

  public static getIntervalTextLength(): number {
    // return the length of the longest interval text
    // 2 times the numbers + [],
    return (ChChartLabelFormatter.defaultFormatNumberShortMaxLength * 2) + 3;
  }

  addData(): void {
    this.y++;
  }

  public getIntervalShortText(): string {
    return `[${ChChartLabelFormatter.formatNumberShort(this.min)},${ChChartLabelFormatter.formatNumberShort(this.max)}]`;
  }

  public getIntervalLongText(): string {
    return `[${this.min},${this.max}]`;
  }

}

/**
 * Build ChChartDataBin from data
 * @param data
 * @param numberOfBins
 */
export function chChartGetDataBins(data: number[], numberOfBins?: number): ChChartDataBin[] {
  const domain: [number, number] = ChChartDomain.getLinearDomain(data);

  const bins: ChChartDataBin[] = [];

  if (numberOfBins == null) {
    numberOfBins = chChartGetDefaultNumberOfBins(data.length);
  }

  // size of the bins (set to 1 if result is 0)
  const thresholds: number = (domain[1] - domain[0]) / numberOfBins || 1;

  // create all the bins
  for (let i = 0; i < numberOfBins; i++) {
    const min = (i * thresholds) + domain[0];
    // for the last bin, use the domain max value
    const max = i === numberOfBins - 1 ? domain[1] : min + thresholds;
    bins.push(new ChChartDataBin(i, 0, min, max));
  }

  // add the data in the right category
  for (const d of data) {
    let index: number = (d - domain[0]) / thresholds;

    // specific condition to prevent index from being
    // outside of array
    if (index >= bins.length) {
      index = bins.length - 1;
    }
    // if the result is an integer, set in previous index to exclude max values from bins
    else if (Number.isInteger(index) && index > 0) {
      index--;
    } else {
      index = Math.trunc(index);
    }

    // add the data to the bin
    bins[index].addData();
  }

  return bins;
}

/**
 * return the default number of bins we can made from the number of data
 * This is the Square root of the number of data round up
 * @param numberOfData
 */
export function chChartGetDefaultNumberOfBins(numberOfData: number = 0): number {
  if (numberOfData <= 0) {
    return 0;
  }
  return Math.ceil(Math.sqrt(numberOfData));
}
