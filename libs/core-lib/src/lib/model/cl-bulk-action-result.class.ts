export class ClBulkActionError {
  id: string;
  name: string;
  message: string;
}

export class ClBulkActionResult {
  total: number;
  successCount: number;
  errorCount: number;
  errors: ClBulkActionError[];
}
