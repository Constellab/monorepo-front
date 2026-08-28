import { Expose, Type } from 'class-transformer';

/**
 * One protected surface the client asked for, as the authorization server describes it.
 *
 * A Resource is not an MCP endpoint specifically - it is anything the authorization server protects
 * and identifies by url. The page renders what it is given rather than translating a known list, so
 * a Resource added on the back needs no front deployment to be shown to the visitor.
 */
export class CaOauthConsentResource {
  /** What the visitor is being asked to hand over, in their words. Backend owned. */
  name: string;

  /** The url identifying the Resource. Backend owned, shown as small print to disambiguate. */
  url: string;

  /** Optional sentence detailing what the client will be able to do there. Backend owned. */
  description?: string;
}

/**
 * What the authorization server reports is being asked, fetched by CaOauthConsentService.
 *
 * TRUST: every field is a backend owned fact and safe to present as such - EXCEPT
 * {@link clientName}, which is chosen by whoever registered the client. Registration is dynamic, so
 * anyone can register one calling itself "Constellab Official". The page frames it as an unverified
 * claim, never renders it as html and never lets it influence styling.
 */
export class CaOauthConsentDetails {
  /**
   * The name the client registered itself under. UNTRUSTED - present as a claim, not as an
   * identity, unless {@link clientNameIsVerified}.
   */
  @Expose({ name: 'client_name' })
  clientName: string;

  /** The only non forgeable client identifier. Safe to show, as small print. */
  @Expose({ name: 'client_id' })
  clientId: string;

  /** False today. If it ever becomes true, {@link clientName} may be shown as an identity. */
  @Expose({ name: 'client_name_is_verified' })
  clientNameIsVerified: boolean;

  /** The signed in user the client will act as. Backend owned. */
  @Expose({ name: 'user_email' })
  userEmail: string;

  /**
   * Every Resource asked for in this pass. Approving covers all of them at once, which is what
   * spares the visitor a second prompt for a single connection.
   */
  @Type(() => CaOauthConsentResource)
  resources: CaOauthConsentResource[];

  /**
   * The single most important thing on the page when present - today, that the client will be able
   * to do anything the visitor can, in every Space they belong to. Backend owned, rendered
   * prominently.
   */
  warning?: string;
}
