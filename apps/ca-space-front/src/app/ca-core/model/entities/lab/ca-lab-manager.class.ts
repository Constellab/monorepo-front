export class CaLabManagerRestoreBackupConfigDTO {
  restoreDb: boolean;
  restoreData: boolean;
  force: boolean;
  destinationLabId: string;
}
