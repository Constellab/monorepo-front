import { inject, Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { HaAuthenticatedUserService } from '../ha-service/ha-authenticated-user.service';

@Injectable({
  providedIn: 'root',
})
export class HaAdminGuard {
  private authenticatedUserService = inject(HaAuthenticatedUserService);

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticatedUserService.isAdmin();
  }
}
