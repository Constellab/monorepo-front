import { PrProtocolGraph } from '@monorepo/protocol';

export class CaTechnicalReport {
  version: number;

  data: CaTechnicalReportData;
}

export interface CaTechnicalReportData {
  graph: PrProtocolGraph;
  human_name: string;
}
