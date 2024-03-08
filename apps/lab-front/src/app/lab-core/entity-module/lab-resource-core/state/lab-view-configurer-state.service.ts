import {LabResourceViewSpecWithConfig} from '../../../model/entities/resource/lab-resource-view.entity';
import {PrConfigValues} from '@monorepo/protocol';
import {FlOverlayRef, FlPortalConfig, FlPortalService} from '@monorepo/front-core-lib';
import {
  LabConfigureResourceViewComponent,
  LabConfigureResourceViewInput,
  LabConfigureResourceViewOutput
} from '../component/lab-configure-resource-view/lab-configure-resource-view.component';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {TdTypeStyle} from '@monorepo/technical-doc';

/**
 * State to open and manage view configuration portal
 */
@Injectable()
export class LabViewConfigurerState {

  private viewConfigOverlay: FlOverlayRef;

  constructor(private portalService: FlPortalService) {

  }

  // prepare the data and open the view configuration portal
  public openConfigPortal(methodName: string, viewName: string, hasConfigSpecs: boolean,
                          resourceId: string, resourceTypingName: string,
                          viewStyle: TdTypeStyle,
                          viewConfigValues: PrConfigValues = {}): Observable<LabResourceViewSpecWithConfig | null> {
    this.viewConfigOverlay?.dispose();

    // if the view doesn't have a config, don't show the config portal, create the view directly
    if (!hasConfigSpecs) {
      return of(this.onViewConfigured({
        viewConfigValues: {}, // empty config
        viewMethodName: methodName,
      }, viewName));
    }

    const specWithConfig: LabResourceViewSpecWithConfig = {
      viewName: viewName,
      viewMethodName: methodName,
      viewConfigValues: viewConfigValues,
    };


    const data: LabConfigureResourceViewInput = {
      resourceTypingName: resourceTypingName,
      resourceId: resourceId,
      title: viewName,
      viewMethodName: methodName,
      preConfiguration: specWithConfig,
      viewStyle: viewStyle
    };

    const portalConfig: FlPortalConfig = this.portalService.configureAbsolutePortal(
      {centerHorizontally: '0', top: '0'},
      {
        disposeOnNavigation: true,
      });

    this.viewConfigOverlay = this.portalService.createPortal(LabConfigureResourceViewComponent, portalConfig, data);

    return this.viewConfigOverlay.detachments().pipe(
      map(config => this.onViewConfigured(config, viewName))
    );
  }

  private onViewConfigured(config: LabConfigureResourceViewOutput, viewName: string): LabResourceViewSpecWithConfig {
    if (config == null) return null;

    return {
      viewConfigValues: config.viewConfigValues,
      viewMethodName: config.viewMethodName,
      viewName: viewName
    };


  }
}
