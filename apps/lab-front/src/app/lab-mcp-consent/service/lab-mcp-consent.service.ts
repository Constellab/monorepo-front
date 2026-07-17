import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Service backing the MCP OAuth consent page.
 *
 * The only backend call it makes is fetching the one-time consent code. That code is single-use and
 * expires after 60s, so it MUST be fetched at the moment of the "Allow" click and never persisted
 * (no storage, no logs). See {@link LabMcpConsentPageComponent}.
 */
@Injectable({
  providedIn: 'root',
})
export class LabMcpConsentService {
  private apiService = inject(FlApiService);

  /**
   * Fetch a fresh single-use consent code (authenticated with the usual lab session).
   *
   * `hideSnackBarError` is set because the caller handles the 401 (→ login) and other errors
   * (→ inline retry) itself; the default error snackbar would be redundant/confusing here.
   */
  public getConsentCode(): Observable<string> {
    return this.apiService
      .get('user/mcp-consent-code', null, { hideSnackBarError: true })
      .pipe(map((result: { code: string }) => result.code));
  }
}
