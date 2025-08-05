import {
  FlCleanableService,
  FlCleanerService,
  FlLocalStorageService,
} from '@monorepo/front-core-lib/fl-core';
import { LiAppEnvironment, LiRouterService } from '@monorepo/lab-lib/li-core';

import { LabEnvironmentHelper } from './lab-environment.helper';

export abstract class LabEnvStore {
  public abstract setLabEnvironment(environment: LiAppEnvironment): void;

  public abstract getLabEnvironment(): LiAppEnvironment;

  public isDev(): boolean {
    return this.getLabEnvironment() === 'dev';
  }
}

/**
 * Class to manage the env from the url
 */
export class LabEnvStoreUrl extends LabEnvStore {
  public setLabEnvironment(environment: LiAppEnvironment): void {
    if (this.getLabEnvironment() === environment) return;

    if (environment === 'dev') {
      window.open(LabEnvironmentHelper.getDevFrontUrls()[0] + LiRouterService.getAppRoute(), '_self');
    } else {
      window.open(LabEnvironmentHelper.getProdFrontUrls()[0] + LiRouterService.getAppRoute(), '_self');
    }
  }

  /**
   * Detect from the url if the app is in dev or prod mode
   */
  public getLabEnvironment(): LiAppEnvironment {
    if (!window) return 'prod';

    const currentUrl = window.location.href;

    // if the current url is one of the dev front url return dev mode,
    // otherwise return prod mode
    const devFrontUrls = LabEnvironmentHelper.getDevFrontUrls();
    for (const devFrontUrl of devFrontUrls) {
      if (currentUrl.startsWith(devFrontUrl)) return 'dev';
    }
    return 'prod';
  }
}

/**
 * Class to manage the env using the local storage
 */
export class LabEnvStoreLocalStorage extends LabEnvStore implements FlCleanableService {
  private readonly labEnvironmentStorageKey: string = 'li-environment';

  constructor(private localStorage: FlLocalStorageService) {
    super();
    FlCleanerService.getInstance().registerService(this);
  }

  public setLabEnvironment(environment: LiAppEnvironment): void {
    if (this.getLabEnvironment() === environment) return;

    this.localStorage.setItem(this.labEnvironmentStorageKey, environment);
    window.location.reload();
  }

  /**
   * Get the lab environment from the local storage
   */
  public getLabEnvironment(): LiAppEnvironment {
    const env: LiAppEnvironment = this.localStorage.getItem(this.labEnvironmentStorageKey) as any;
    if (env === 'dev') return 'dev';
    return 'prod';
  }

  public clearLabEnvironmentStorage(): void {
    this.localStorage.removeItem(this.labEnvironmentStorageKey);
  }

  clean(): void {
    // this.clearLabEnvironmentStorage();
  }
}
