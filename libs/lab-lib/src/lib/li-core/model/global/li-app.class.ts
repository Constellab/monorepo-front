import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { LiUser } from '../entities/li-user.entity';

export enum LiAppStopPolicy {
  AUTO = 'AUTO',
  MANUAL = 'MANUAL',
}

export class LiAppInstance {
  @Expose({ name: 'app_type' })
  appType: string;

  @Expose({ name: 'app_resource_id' })
  appResourceId: string;

  name: string;

  @Expose({ name: 'env_type' })
  envType: string;

  @Expose({ name: 'source_ids' })
  sourceIds: string[];

  @Expose({ name: 'env_file_path' })
  envFilePath?: string;

  @Expose({ name: 'env_file_content' })
  envFileContent?: string;

  @Expose({ name: 'stop_policy' })
  stopPolicy: LiAppStopPolicy;

  @Expose({ name: 'custom_subdomain' })
  customSubdomain?: string;
}

export class LiAppProcessStatus {
  id: string;

  status: 'RUNNING' | 'STOPPED' | 'STARTING';

  @Expose({ name: 'status_text' })
  statusText?: string;

  @Expose({ name: 'config_file_path' })
  configFilePath: string;

  @Type(() => LiAppInstance)
  app: LiAppInstance;

  @Expose({ name: 'nb_of_connections' })
  nbOfConnections: number;

  @Expose({ name: 'started_at' })
  @ClLuxonDateTimeTransform()
  startedAt: DateTime;

  @Expose({ name: 'started_by' })
  @Type(() => LiUser)
  startedBy: LiUser;

  // Bare host URL (scheme + host + port, no auth token) reachable via the app's custom
  // subdomain alias. Null when the app has no custom subdomain (or in dev mode).
  @Expose({ name: 'custom_subdomain_url' })
  customSubdomainUrl?: string;
}

export class LiAppsStatus {
  @Type(() => LiAppProcessStatus)
  processes: LiAppProcessStatus[];
}

/**
 * Lightweight status of an app process being started, as returned verbatim by the backend
 * `apps/process/{token}/status` route. Used by the open-app gateway page to show progress.
 */
export interface LiAppProcessStartingStatus {
  id: string;

  status: 'RUNNING' | 'STOPPED' | 'STARTING';

  status_text?: string;
}

/**
 * Response of the app-link gateway `start` call: the token to poll for status, plus the
 * `authorize_grant` the front must keep in page state and send back to `handoff`.
 * `authorize_grant` is null for a PUBLIC app (no auth), a string for an AUTHENTICATED app.
 */
export interface LiAppGatewayStart {
  status_token: string;

  authorize_grant: string | null;
}

/**
 * Response of the app-link gateway `handoff` call: the app host URL carrying `?gws_code=…`.
 */
export interface LiAppGatewayHandoff {
  app_url: string;
}

// App detail
export class LiAppInstanceUrl {
  @Expose({ name: 'host_url' })
  hostUrl: string;

  params: Record<string, string>;
}

export class LiAppInstanceDetail {
  @Type(() => LiAppInstance)
  app: LiAppInstance;

  @Type(() => LiAppInstanceUrl)
  url: LiAppInstanceUrl;
}
