export class CaLabManagerRecommendedVersion {
  labManagerRecommendedVersion: string;
}

export class CaLabManagerRestoreBackupConfigDTO {
  restoreDb: boolean;
  restoreData: boolean;
  force: boolean;
  destinationLabId: string;
}
