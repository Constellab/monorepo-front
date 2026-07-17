import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LabOAuthConsentDetails } from '../model/lab-oauth-consent-details.class';

/**
 * Service backing the OAuth consent page.
 *
 * Two backend calls:
 *  - {@link getConsentDetails}: on load, describes what is being authorized (no credential).
 *  - {@link getConsentCode}: on the Allow click only — the code is single-use and expires after 60s,
 *    so it must never be fetched early, stored, or logged. See {@link LabOAuthConsentPageComponent}.
 *
 * `hideSnackBarError` is set on both because the caller maps status codes to specific UI states
 * (401 → login, 404 → expired, etc.); the default error snackbar would be redundant/confusing.
 */
@Injectable({
  providedIn: 'root',
})
export class LabOAuthConsentService {
  private apiService = inject(FlApiService);

  /**
   * Describe what is being authorized. Safe on load: returns a description, not a credential.
   * The backend answers 404 if the pending authorization is unknown/expired.
   */
  public getConsentDetails(loginState: string): Observable<LabOAuthConsentDetails> {
    return this.apiService.get('user/oauth-consent-details', LabOAuthConsentDetails, {
      hideSnackBarError: true,
      params: { login_state: loginState },
    });
  }

  /** Fetch a fresh single-use consent code (authenticated with the usual lab session). */
  public getConsentCode(): Observable<string> {
    return this.apiService
      .get('user/oauth-consent-code', null, { hideSnackBarError: true })
      .pipe(map((result: { code: string }) => result.code));
  }
}
