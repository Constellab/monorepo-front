import {FlPortalConfig} from '@monorepo/front-core-lib';
import {GlobalPositionStrategy} from '@angular/cdk/overlay';

export class HaCommentsPortalConfig extends FlPortalConfig{
  static create(): HaCommentsPortalConfig {
    const config: FlPortalConfig = new FlPortalConfig().configureOverlay({
      disposeOnOutsideClick: true,
      height: '100vh',
      minWidth: '25%',
      maxWidth: '100%',
      hasBackdrop: true,
    });

    const globalPosition: GlobalPositionStrategy = new GlobalPositionStrategy();
    globalPosition.top('0');
    globalPosition.right('0');

    config.setPositionStrategy(globalPosition)
    return config;
  }
}
