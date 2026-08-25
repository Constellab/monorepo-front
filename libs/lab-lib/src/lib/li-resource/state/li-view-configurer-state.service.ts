import { inject, Injectable } from '@angular/core';
import { FlOverlayRef, FlPortalConfig, FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { LiResourceViewSpecWithConfig } from '@monorepo/lab-lib/li-core';
import { TdParamSpecsValues, TdTypeStyle } from '@monorepo/technical-doc';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  LiConfigureResourceViewComponent,
  LiConfigureResourceViewInput,
  LiConfigureResourceViewOutput,
} from '../component/li-configure-resource-view/li-configure-resource-view.component';

/**
 * State to open and manage view configuration portal
 */
@Injectable()
export class LiViewConfigurerState {
  private portalService = inject(FlPortalService);

  private viewConfigOverlay: FlOverlayRef;

  // prepare the data and open the view configuration portal
  public openConfigPortal(
    methodName: string,
    viewName: string,
    hasConfigSpecs: boolean,
    resourceId: string | null,
    resourceTypingName: string,
    viewStyle: TdTypeStyle,
    viewConfigValues: TdParamSpecsValues = {}
  ): Observable<LiResourceViewSpecWithConfig | null> {
    this.viewConfigOverlay?.dispose();

    // if the view doesn't have a config, don't show the config portal, create the view directly
    if (!hasConfigSpecs) {
      return of(
        this.onViewConfigured(
          {
            viewConfigValues: {}, // empty config
            viewMethodName: methodName,
          },
          viewName
        )
      );
    }

    const specWithConfig: LiResourceViewSpecWithConfig = {
      viewName: viewName,
      viewMethodName: methodName,
      viewConfigValues: viewConfigValues,
    };

    const data: LiConfigureResourceViewInput = {
      resourceTypingName: resourceTypingName,
      resourceId: resourceId ?? undefined,
      title: viewName,
      viewMethodName: methodName,
      preConfiguration: specWithConfig,
      viewStyle: viewStyle,
    };

    const portalConfig: FlPortalConfig = this.portalService.configureAbsolutePortal(
      { centerHorizontally: '0', top: '0' },
      {
        disposeOnNavigation: true,
      }
    );

    this.viewConfigOverlay = this.portalService.createPortal(
      LiConfigureResourceViewComponent,
      portalConfig,
      data
    );

    return this.viewConfigOverlay
      .detachments()
      .pipe(map((config) => this.onViewConfigured(config, viewName)));
  }

  private onViewConfigured(
    config: LiConfigureResourceViewOutput,
    viewName: string
  ): LiResourceViewSpecWithConfig | null {
    if (config == null) return null;

    return {
      viewConfigValues: config.viewConfigValues,
      viewMethodName: config.viewMethodName,
      viewName: viewName,
    };
  }
}
