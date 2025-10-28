import { Injectable } from '@angular/core';
import { LiApiErrorService } from '@monorepo/lab-lib/li-core';

@Injectable()
export class DcApiErrorService extends LiApiErrorService {
  // this should not happen, so we do nothing
  logoutUser(): void {}
}
