import { Injectable, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ClDateHelper } from '@monorepo/core-lib';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {
  FlAcceptanceCookie,
  FlAcceptanceCookiesConfig,
  FlCookieOptions,
  FlPlatformService,
} from '@monorepo/front-core-lib/fl-core';

/**
 * Service to manage browser cookies.
 *
 * Get, set and delete cookies.
 */
@Injectable({ providedIn: 'root' })
export class FlCookieService {
  private cookieService = inject(CookieService);
  private platformService = inject(FlPlatformService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  private readonly ACCEPTANCE_COOKIE_KEY = 'ACCEPT_COOKIE';

  /**
   * Check the cookies acceptances
   * @param config config to check the user cookies acceptance
   */
  public checkCookiesAcceptance(config: FlAcceptanceCookiesConfig): Observable<boolean> {
    if (config == null || !this.canAccessCookies()) {
      return of(false);
    }

    const acceptanceCookie: FlAcceptanceCookie = this.getParsedCookie(this.ACCEPTANCE_COOKIE_KEY);

    // check if the cookie exist and if the version has been accepted
    if (acceptanceCookie != null && acceptanceCookie.version >= config.version) {
      return of(acceptanceCookie.choice ?? false);
    }

    // if we need to ask the permissions
    if (config.displayMode === 'dialog') {
      return this.dialog
        .open(config.component, {
          hasBackdrop: false,
        })
        .afterClosed()
        .pipe(
          map((response: boolean) => {
            if (response != undefined) {
              this.setCookieAcceptance(config.version, response);
              return response;
            }
            return false;
          })
        );
    } else {
      return this.snackBar
        .openFromComponent(config.component, { duration: -1, panelClass: 'g-snackbar-card' })
        .afterDismissed()
        .pipe(
          map((value) => {
            if (value?.dismissedByAction?.valueOf()) {
              this.setCookieAcceptance(config.version, true);
              return true;
            }
            this.setCookieAcceptance(config.version, false);
            return false;
          })
        );
    }
  }

  /**
   * Set the cookie acceptance in the cookies
   * @param version of the acceptance
   * @param choice
   */
  public setCookieAcceptance(version: number, choice: boolean = false): void {
    const acceptanceCookie: FlAcceptanceCookie = {
      choice: choice,
      version: version,
      date: new Date().getTime(),
    };

    this.setCookie(this.ACCEPTANCE_COOKIE_KEY, acceptanceCookie, {
      expires: this.getDateInOneYear(),
      sameSite: 'Strict',
    });
  }

  /**
   * Get cookie parsed value
   * @param key key of the cookie
   * @param defaultValue the value returned if the cookie key does not exist
   * @return the parsed value of the cookie
   */
  public getParsedCookie(key: string, defaultValue: any = null): any {
    return JSON.parse(this.getStringCookie(key, defaultValue));
  }

  /**
   * Get the cookie value as a string
   * @param key key of the cookie
   * @param defaultValue the value returned if the cookie key does not exist
   * @return the string of the cookie
   */
  public getStringCookie(key: string, defaultValue: any = null): string {
    if (!this.canAccessCookies()) {
      return null;
    }

    return this.cookieService.get(key) || defaultValue;
  }

  /**
   * Stringify and set the cookie value
   * @param key key of the new or updated cookies
   * @param value value of the cookie (will be stringify if needed)
   * @param options options to store the cookie
   */
  public setCookie(
    key: string,
    value: any,
    options: FlCookieOptions = { sameSite: 'Strict', path: '/' }
  ): void {
    if (!this.canAccessCookies()) {
      return;
    }

    let cookieValue: any = value;

    // stringify none string
    if (typeof cookieValue !== 'string') {
      cookieValue = JSON.stringify(cookieValue);
    }

    // set the cookie
    this.cookieService.set(
      key,
      cookieValue,
      options.expires,
      options.path,
      options.domain,
      options.secure,
      options.sameSite
    );
  }

  /**
   * Delete a cookie
   * @param key key of the cookie to delete
   * @param options options to store the cookie
   */
  public removeCookie(key: string, options: FlCookieOptions = { sameSite: 'Strict', path: '/' }): void {
    if (!this.canAccessCookies()) {
      return;
    }
    this.cookieService.delete(key, options.path, options.domain, options.secure, options.sameSite);
  }

  /**
   * Delete all the cookies
   */
  private removeAllCookies(): void {
    if (!this.canAccessCookies()) {
      return;
    }
    this.cookieService.deleteAll();
  }

  /**
   * Return true if the cookies are accessible
   */
  public canAccessCookies(): boolean {
    return this.platformService.isBrowserPlatform();
  }

  /**
   * returns true if the cookie exists
   * @param name name of the cookie to check
   */
  public check(name: string): boolean {
    return this.cookieService.check(name);
  }

  private getDateInOneYear(): Date {
    return new Date(new Date().getTime() + ClDateHelper.ONE_YEAR);
  }
}
