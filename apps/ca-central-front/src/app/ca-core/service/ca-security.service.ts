import { inject, Injectable } from '@angular/core';
import { CaAuthenticatedUserService } from '../service-api/ca-authenticated-user.service';

/**
 * Service that group all the method to check if the current user can make an action
 */
@Injectable({
  providedIn: 'root',
})
export class CaSecurityService {
  private authenticatedUserService = inject(CaAuthenticatedUserService);

  public canEditFolder(folderLeaderId: string): boolean {
    if (folderLeaderId == null) return false;
    return (
      this.authenticatedUserService.isCurrentSpaceAdmin() ||
      this.authenticatedUserService.getCurrentUser().id === folderLeaderId
    );
  }
}
