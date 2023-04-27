/**
 * Object containing a list of data
 */
export interface ChChartDataContainer<Data> {

  getData(): Data[];
}

export interface ChChartData {

  /**
   * Value of getter that tell if the chart data is valid and can be added to the chart
   */
  valid: boolean;

  tags?: Record<string, string>;
}

export class ChChart2dDatum implements ChChartData {

  tags?: Record<string, string>;

  constructor(protected x: number, protected y: number) {
  }

  getX(defaultValue: number = null): number {
    return this.x ?? defaultValue;
  }

  getY(defaultValue: number = null): number {
    return this.y ?? defaultValue;
  }


  get valid(): boolean {
    return this.x != null && this.y != null;
  }
}

export class ChChart3dDatum extends ChChart2dDatum {
  constructor(x: number, y: number, private z: number) {
    super(x, y);
  }

  getZ(defaultValue: number = null): number {
    return this.z ?? defaultValue;
  }

  get valid(): boolean {
    return this.x != null && this.y != null && this.z != null;
  }
}
