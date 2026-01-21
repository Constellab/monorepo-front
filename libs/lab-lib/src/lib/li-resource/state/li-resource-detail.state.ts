import { ComponentType } from '@angular/cdk/overlay';
import {
  computed,
  inject,
  Injectable,
  OnDestroy,
  Signal,
  signal,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core';
import {
  FlEntityPaginatedDatasource,
  FlQueryParamHandler,
  FlStatusEvent,
} from '@monorepo/front-core-lib/fl-core';
import { FlOverlayRef, FlPortalConfig, FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalActionResult, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import {
  LiResource,
  LiResourceService,
  LiResourceView,
  LiResourceViewSpec,
  LiResourceViewSpecWithConfig,
  LiViewConfig,
  LiViewConfigDatasource,
  LiViewConfigService,
} from '@monorepo/lab-lib/li-core';
import { TdParamSpecsValues } from '@monorepo/technical-doc';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import {
  LiResourceViewPortalComponent,
  LiResourceViewPortalInput,
} from '../component/li-resource-view-portal/li-resource-view-portal.component';
import { LiViewConfigurerState } from './li-view-configurer-state.service';

@Injectable()
export class LiResourceDetailState implements OnDestroy {
  private resourceService = inject(LiResourceService);
  private actionService = inject(FlPortalActionsService);
  private portalService = inject(FlPortalService);
  private viewConfigService = inject(LiViewConfigService);
  private viewContainerRef = inject(ViewContainerRef);
  private viewConfigState = inject(LiViewConfigurerState);
  private queryParamHandler: FlQueryParamHandler<{
    resourceId: string;
    viewId: string;
    hideHeader: string;
  }> = inject(FlQueryParamHandler);

  private static id = 0;
  private id = LiResourceDetailState.id++;

  private mainResourceId: WritableSignal<string> = signal(null);
  private selectedResourceId: WritableSignal<string> = signal(null);

  private resources: WritableSignal<LiResource[]> = signal([]);

  private _selectedView: WritableSignal<FlStatusEvent<LiResourceView>> = signal(null);

  private favoriteViews: Record<string, LiViewConfigDatasource> = {};

  private hideHeader: WritableSignal<boolean> = signal(false);

  // if true the query param handler will be updated
  private updateQueryParams: boolean;

  private viewPortalSubscription: Subscription;

  public mainResource: Signal<LiResource> = computed(() => {
    const mainId = this.mainResourceId();
    const resources = this.resources();
    return resources.find((resource) => resource.id === mainId);
  });

  public childrenResources: Signal<LiResource[]> = computed(() => {
    const mainResourceId = this.mainResourceId();
    const resources = this.resources();
    return resources.filter((resource) => resource.id !== mainResourceId);
  });

  public hasChildren: Signal<boolean> = computed(() => {
    const mainResource = this.mainResource();
    return mainResource?.hasChildren ?? false;
  });

  public selectedResource: Signal<LiResource> = computed(() => {
    const selectedId = this.selectedResourceId();
    const resources = this.resources();
    return resources.find((resource) => resource.id === selectedId);
  });

  public get selectedView(): Signal<FlStatusEvent<LiResourceView>> {
    return this._selectedView.asReadonly();
  }

  public init(resourceId: string, updateQueryParams: boolean): void {
    this.initResource(resourceId);
    this.mainResourceId.set(resourceId);

    // check the query param to select the right resource
    this.queryParamHandler.getFirstQueryParams().subscribe((params) => {
      if (params.resourceId) {
        this.selectResource(params.resourceId, params.viewId, false);
      } else {
        // load the main resource
        this.selectResource(resourceId, params.viewId, false);
      }

      // Initialize hideHeader from query params
      if (params.hideHeader != null) {
        this.hideHeader.set(params.hideHeader === 'true');
      }
    });

    this.updateQueryParams = updateQueryParams;
    this.subscribeToViewPortal();
  }

  private initResource(resourceId: string): void {
    this.resourceService.getById(resourceId).subscribe((resource) => this.initResourceSuccess(resource));
  }

  private initResourceSuccess(resource: LiResource): void {
    this.resources.set([resource]);
    if (resource.hasChildren) {
      this.resourceService
        .getResourceChildren(resource.id)
        .subscribe((children) => this.resources.update((resources) => [...resources, ...children]));
    }

    /**
     * For application, hide the header by default unless specified in query params
     */
    if (resource.isApplication) {
      this.queryParamHandler.getFirstQueryParams().subscribe((params) => {
        if (params.hideHeader == null) {
          this.setHideHeader(true);
        }
      });
    }
  }

  /**
   * Select the resource for the page
   * @param resourceId the resource id
   * @param viewId (optional) the view id to load, if not provided the default view will be loaded
   * @param setQueryParams (optional) if true the query params will be updated
   */
  public selectResource(resourceId: string, viewId: string = null, setQueryParams: boolean = true): void {
    if (resourceId === this.selectedResourceId()) return;
    this.selectedResourceId.set(resourceId);

    if (viewId) {
      this.loadViewFromId(viewId);
    } else {
      this.loadDefaultView(resourceId);
    }
    if (setQueryParams && this.updateQueryParams) {
      this.queryParamHandler.mergeQueryParams({ resourceId, viewId });
    }
  }

  private loadDefaultView(resourceId: string): void {
    this.loadMainView(this.resourceService.callResourceDefaultView(resourceId, true));
  }

  private loadViewFromId(viewId: string): void {
    this.loadMainView(this.viewConfigService.callViewConfig(viewId));
  }

  private loadMainView(obs: Observable<LiResourceView>): void {
    this._selectedView.set({ status: 'loading' });
    obs.subscribe({
      next: (view) => this._selectedView.set({ status: 'success', object: view }),
      error: (error) => this._selectedView.set({ status: 'error', error: error }),
    });
  }

  public updateResource(resource: LiResource): void {
    this.resources.update((resources) => {
      const index = resources.findIndex((r) => r.id === resource.id);
      if (index >= 0) {
        resources[index] = resource;
      }
      return [...resources];
    });
  }

  ////////////////////////////////////// VIEWS /////////////////////////////////////
  public addViewFromConfig(viewConfigId: string, viewName: string): void {
    this.callView(this.viewConfigService.callViewConfig(viewConfigId), viewName);
  }

  public addViewFromSpecs(resourceId: string, config: LiResourceViewSpecWithConfig): void {
    this.callView(
      this.callResourceView(resourceId, config.viewMethodName, config.viewConfigValues),
      config.viewName
    );
  }

  /**
   * Call and open the view in a portal, using the action service
   */
  public callView(view$: Observable<LiResourceView>, viewName: string): void {
    this.actionService.addAction({
      type: this.actionType,
      text: { text: viewName, translateText: false },
      action: view$,
      autoClose: true,
    });
  }

  public setMainView(view: LiResourceView): void {
    this._selectedView.set({ status: 'success', object: view });
    if (view.viewConfig) {
      this.queryParamHandler.mergeQueryParams({ viewId: view.viewConfig.id });
    }
  }

  private callResourceView(
    resourceId: string,
    methodName: string,
    configValues: TdParamSpecsValues
  ): Observable<LiResourceView> {
    return this.resourceService.callResourceView(resourceId, methodName, configValues, true);
  }

  public undockCurrentView(): void {
    const view = this._selectedView();
    if (view.status === 'success') {
      this.openViewInPortal(view.object);
    }
  }

  public getSelectedResourceFavoriteViews(): LiViewConfigDatasource {
    return this.getFavoriteViews(this.selectedResourceId());
  }

  private getFavoriteViews(resourceId: string): LiViewConfigDatasource {
    if (this.favoriteViews[resourceId] == null) {
      this.favoriteViews[resourceId] = new FlEntityPaginatedDatasource(
        (page, pageSize) => this.viewConfigService.getByResource(resourceId, true, page, pageSize),
        10,
        {
          disableAutoDisconnect: true,
        }
      );
    }
    return this.favoriteViews[resourceId];
  }

  ////////////////////////////////////// VIEWS PORTAL /////////////////////////////////////

  /**
   * subscribe to action service to open views in a portal
   * @private
   */
  private subscribeToViewPortal(): void {
    this.viewPortalSubscription?.unsubscribe();
    // subscribe to portal view to open them
    this.viewPortalSubscription = this.actionService
      .getResult$(this.actionType)
      .pipe(filter((result) => result.status === 'success'))
      .subscribe((result: FlPortalActionResult<LiResourceView>) => this.openViewInPortal(result.result));
  }

  private openViewInPortal(labView: LiResourceView): void {
    const portalConfig: FlPortalConfig = this.portalService.configureAbsolutePortal(
      { centerHorizontally: '0', top: '0' },
      {
        disposeOnNavigation: true,
      }
    );

    const config: LiResourceViewPortalInput = {
      labView: labView,
      resourceState: this,
    };

    this.createPortal(LiResourceViewPortalComponent, portalConfig, config);
  }

  public createPortal(
    component: ComponentType<any>,
    config: FlPortalConfig,
    data: any = {},
    viewContainerRef: boolean = false
  ): FlOverlayRef {
    return this.portalService.createPortal(
      component,
      config,
      data,
      viewContainerRef ? this.viewContainerRef : undefined
    );
  }

  public updateView(view: LiResourceView, viewOverlayRef: FlOverlayRef): void {
    const resource = this.resources().find((r) => r.id === view.resourceId);
    if (resource == null) return;
    this.viewConfigState
      .openConfigPortal(
        view.viewConfig.viewName,
        view.title,
        true,
        resource.id,
        resource.resourceTypingName,
        view.style,
        view.viewConfig.configValues
      )
      .subscribe((result) => this.onViewConfiguredClosed(resource.id, result, viewOverlayRef));
  }

  ////////////////////////////////////// VIEW CONFIG /////////////////////////////////////
  // prepare the data and open the view configuration portal
  public openConfigPortal(view: LiResourceViewSpec): void {
    const resource = this.selectedResource();
    this.viewConfigState
      .openConfigPortal(
        view.methodName,
        view.getName(),
        view.hasConfigSpecs,
        resource.id,
        resource.resourceTypingName,
        view.style
      )
      .subscribe((result) => this.onViewConfiguredClosed(resource.id, result));
  }

  private onViewConfiguredClosed(
    resourceId: string,
    config?: LiResourceViewSpecWithConfig,
    overlayRef?: FlOverlayRef
  ): void {
    if (config == null) return;
    this.addViewFromSpecs(resourceId, config);

    if (overlayRef) {
      overlayRef.dispose();
    }
  }

  /**
   * Update a favorite view config in the datasource
   * @param viewConfig
   */
  public updateViewConfig(viewConfig: LiViewConfig): void {
    const datasource = this.getFavoriteViews(viewConfig.resource.id);
    if (datasource == null) return;
    // remove the view config if it is not favorite anymore (if it exists in the datasource)
    if (!viewConfig.isFavorite) {
      datasource.removeItem(viewConfig);
    } else {
      // add/update the view config if it is favorite and not in the datasource
      datasource.addOrUpdateItem(viewConfig, () => true);
    }
  }

  get actionType(): string {
    // use id to make sure that the action type is unique by state
    return `view-portal-loader-${this.id}`;
  }

  public setHideHeader(hide: boolean): void {
    this.hideHeader.set(hide);
    if (this.updateQueryParams) {
      this.queryParamHandler.mergeQueryParams({ hideHeader: hide.toString() });
    }
  }

  public get isHeaderHidden(): Signal<boolean> {
    return this.hideHeader.asReadonly();
  }

  ngOnDestroy(): void {
    this.viewPortalSubscription?.unsubscribe();
  }
}
