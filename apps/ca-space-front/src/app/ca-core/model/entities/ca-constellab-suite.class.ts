export class CnConstellabSuiteAppDTO {
  name: string;
  emoji: string;
  background: string;
  shortDescription: string;
  communityAppLink: string;
}

export class CnConstellabSuiteDTO {
  apps: CnConstellabSuiteAppDTO[];
}

export interface CnRequestAppDTO {
  appName: string;
}
