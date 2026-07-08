export class CaConstellabSuiteAppDTO {
  name: string;
  emoji: string;
  background: string;
  shortDescription: string;
  communityAppLink: string;
}

export class CaConstellabSuiteDTO {
  apps: CaConstellabSuiteAppDTO[];
}

export interface CaRequestAppDTO {
  appName: string;
}
