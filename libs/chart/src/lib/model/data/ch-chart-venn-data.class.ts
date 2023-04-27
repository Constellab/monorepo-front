export interface ChChartVennData {
  groupNames: string[]; // all the group names
  totalNbOfGroups: number;
  sections: ChChartVennDataSection[];
}

export interface ChChartVennDataSection {
  groupNames: string[]; // column ensemble
  data: any[]; // list of values that are in all the group listed in groupNames
}
