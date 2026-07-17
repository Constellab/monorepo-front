import { Expose } from 'class-transformer';

/**
 * What the backend reports is being authorized, fetched from `GET user/oauth-consent-details`.
 *
 * TRUST: every field here is a backend-owned fact and safe to present as such — EXCEPT
 * {@link clientName}, which is attacker-controlled (client registration is open, so anyone can
 * register a client calling itself "Constellab Official"). The UI must frame `clientName` as an
 * unverified claim and never render it as HTML / let it influence styling. See the component and
 * the v2 spec's "Trust rules".
 */
export class LabOAuthConsentDetails {
  /**
   * The name the client registered itself under. UNTRUSTED / attacker-controlled — present as a
   * claim ("A client calling itself …"), never as an identity, unless {@link clientNameIsVerified}.
   */
  @Expose({ name: 'client_name' })
  clientName: string;

  /** The only non-forgeable client identifier. Safe to show (as small print) to disambiguate. */
  @Expose({ name: 'client_id' })
  clientId: string;

  /** `false` today. If it ever becomes `true`, {@link clientName} may be shown as an identity. */
  @Expose({ name: 'client_name_is_verified' })
  clientNameIsVerified: boolean;

  /** e.g. "MCP server". Backend-owned. */
  @Expose({ name: 'resource_name' })
  resourceName: string;

  /** The lab this authorization targets, e.g. https://glab-dev.rio.gencovery.io. Backend-owned. */
  @Expose({ name: 'lab_url' })
  labUrl: string;

  /** The signed-in user the client will act as. Backend-owned. */
  @Expose({ name: 'user_email' })
  userEmail: string;

  /** Derived from whether scopes are enforced (e.g. "full"). Backend-owned. */
  @Expose({ name: 'access_level' })
  accessLevel: string;

  /** One-line summary of what the client may do, e.g. "Act as you on this lab". Backend-owned. */
  @Expose({ name: 'access_summary' })
  accessSummary: string;

  /** Itemised access description. Backend-owned. */
  @Expose({ name: 'access_details' })
  accessDetails: string[];

  /**
   * The single most important thing on the page when present (today: the client gets the user's
   * full permissions). Backend-owned; render prominently.
   */
  warning?: string;
}
