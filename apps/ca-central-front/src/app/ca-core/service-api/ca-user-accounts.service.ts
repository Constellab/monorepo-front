import { Injectable } from '@angular/core';
import { CaNewUser, CaUser, CaUserUpdateLicenseDTO } from '../model/entities/ca-user.class';
import { Observable } from 'rxjs';
import { FlApiService, FlUserAccountService } from '@monorepo/front-core-lib';

/**
 * Service to manage users' accounts
 */
@Injectable({
  providedIn: 'root'
})
export class CaUserAccountsService extends FlUserAccountService {

  private readonly route: string = 'accounts';

  constructor(private apiService: FlApiService) {
    super();
  }

  /**
   * Signup a new user
   */
  public signup(user: CaNewUser): Observable<CaUser> {
    delete user.repeatPassword;
    return this.apiService.post(this.route, user, CaUser);
  }

  /**
   * Route to send an email with password reset link
   */
  public passwordForgotten(email: string): Observable<void> {
    return this.apiService.post(`${this.route}/password-forgotten`, { email: email });
  }

  /**
   * Route with a token to reset the user password
   */
  public resetPassword(password: string, token: string): Observable<void> {
    return this.apiService.post(`${this.route}/reset-password/${token}`, { password: password });
  }


  /**
   * Public route to accept an invitation when a new user is registered
   * @param code
   * @param user
   */
  public createUserAndJoinSpace(code: string, user: CaNewUser): Observable<CaUser> {
    delete user.repeatPassword;
    return this.apiService.post(`${this.route}/sign-up-in-space/${code}`, user, CaUser);
  }

  public lockUser(userId: string): Observable<CaUser> {
    return this.apiService.put(`${this.route}/${userId}/lock`, null, CaUser);
  }

  public unlockUser(userId: string): Observable<CaUser> {
    return this.apiService.put(`${this.route}/${userId}/lock`, null, CaUser);
  }

  public updateLicense(userId: string, license: CaUserUpdateLicenseDTO): Observable<CaUser> {
    return this.apiService.put(`${this.route}/${userId}/license`, license, CaUser);
  }

}
