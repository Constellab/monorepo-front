import { FlCleanableService, FlCleanerService, FlLocalStorageService } from '@monorepo/front-core-lib';
import { LabAppEnvironment } from '../model/global/lab-environment.class';
import { LabEnvironmentHelper } from '../utils/lab-environment.helper';
import { LabRouterService } from './lab-router.service';

export abstract class LabEnvStore {
  public abstract setLabEnvironment(environment: LabAppEnvironment): void;

  public abstract getLabEnvironment(): LabAppEnvironment;

  public isDev(): boolean {
    return this.getLabEnvironment() === 'dev';
  }
}

/**
 * Class to manage the env from the url
 */
export class LabEnvStoreUrl extends LabEnvStore {
  public setLabEnvironment(environment: LabAppEnvironment): void {
    if (this.getLabEnvironment() === environment) return;

    if (environment === 'dev') {
      window.open(LabEnvironmentHelper.getDevFrontUrls()[0] + LabRouterService.getAppRoute(), '_self');
    } else {
      window.open(LabEnvironmentHelper.getProdFrontUrls()[0] + LabRouterService.getAppRoute(), '_self');
    }
  }

  /**
   * Detect from the url if the app is in dev or prod mode
   */
  public getLabEnvironment(): LabAppEnvironment {
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
  private readonly labEnvironmentStorageKey: string = 'lab-environment';

  constructor(private localStorage: FlLocalStorageService) {
    super();
    FlCleanerService.getInstance().registerService(this);
  }

  public setLabEnvironment(environment: LabAppEnvironment): void {
    if (this.getLabEnvironment() === environment) return;

    this.localStorage.setItem(this.labEnvironmentStorageKey, environment);
    window.location.reload();
  }

  /**
   * Get the lab environment from the local storage
   */
  public getLabEnvironment(): LabAppEnvironment {
    const env: LabAppEnvironment = this.localStorage.getItem(this.labEnvironmentStorageKey) as any;
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
