import {
  computed,
  Injectable,
  OnDestroy,
  Signal,
  signal,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core';
import { LabResource } from '../../../model/entities/resource/lab-resource.entity';
import { LabResourceService } from '../../../entity-service/lab-resource.service';
import {
  LabResourceView,
  LabResourceViewSpec,
  LabResourceViewSpecWithConfig,
} from '../../../model/entities/resource/lab-resource-view.entity';
import {
  FlEntityPaginatedDatasource,
  FlOverlayRef,
  FlPortalActionResult,
  FlPortalActionsService,
  FlPortalConfig,
  FlPortalService,
  FlQueryParamHandler,
  FlStatusEvent,
} from '@monorepo/front-core-lib';
import { LabViewConfigService } from '../../../entity-service/lab-view-config.service';
import {
  LabResourceViewPortalComponent,
  LabResourceViewPortalInput,
} from '../component/lab-resource-view-portal/lab-resource-view-portal.component';
import { Observable, Subscription } from 'rxjs';
import { PrConfigValues } from '@monorepo/protocol';
import { filter } from 'rxjs/operators';
import {
  LabViewConfig,
  LabViewConfigDatasource,
} from '../../../model/entities/resource/lab-view-config.entity';
import { ComponentType } from '@angular/cdk/overlay';
import { ActivatedRoute, Router } from '@angular/router';
import { LabViewConfigurerState } from './lab-view-configurer-state.service';

export interface LabMinimizedView {
  symbol: symbol;
  view: LabResourceView;
}

@Injectable()
export class LabResourceDetailState implements OnDestroy {
  private static id = 0;
  private id = LabResourceDetailState.id++;

  private mainResourceId: WritableSignal<string> = signal(null);
  private selectedResourceId: WritableSignal<string> = signal(null);

  private resources: WritableSignal<LabResource[]> = signal([]);

  private _selectedView: WritableSignal<FlStatusEvent<LabResourceView>> = signal(null);
  private _minimizedViews: WritableSignal<LabMinimizedView[]> = signal([]);

  private favoriteViews: Record<string, LabViewConfigDatasource> = {};

  // if true the query param handler will be updated
  private updateQueryParams: boolean;

  private viewPortalSubscription: Subscription;

  private queryParamHandler: FlQueryParamHandler<{ resourceId: string; viewId: string }>;

  public mainResource: Signal<LabResource> = computed(() => {
    const mainId = this.mainResourceId();
    const resources = this.resources();
    return resources.find((resource) => resource.id === mainId);
  });

  public childrenResources: Signal<LabResource[]> = computed(() => {
    const mainResourceId = this.mainResourceId();
    const resources = this.resources();
    return resources.filter((resource) => resource.id !== mainResourceId);
  });

  public hasChildren: Signal<boolean> = computed(() => {
    const mainResource = this.mainResource();
    return mainResource?.hasChildren ?? false;
  });

  public selectedResource: Signal<LabResource> = computed(() => {
    const selectedId = this.selectedResourceId();
    const resources = this.resources();
    return resources.find((resource) => resource.id === selectedId);
  });

  public get selectedView(): Signal<FlStatusEvent<LabResourceView>> {
    return this._selectedView.asReadonly();
  }

  public get minimizedViews(): Signal<LabMinimizedView[]> {
    return this._minimizedViews.asReadonly();
  }

  constructor(
    private resourceService: LabResourceService,
    private actionService: FlPortalActionsService,
    private portalService: FlPortalService,
    private viewConfigService: LabViewConfigService,
    private viewContainerRef: ViewContainerRef,
    private viewConfigState: LabViewConfigurerState,
    route: ActivatedRoute,
    router: Router
  ) {
    this.queryParamHandler = new FlQueryParamHandler(router, route);
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
    });

    this.updateQueryParams = updateQueryParams;
    this.subscribeToViewPortal();
  }

  private initResource(resourceId: string): void {
    this.resourceService.getById(resourceId).subscribe((resource) => this.initResourceSuccess(resource));
  }

  private initResourceSuccess(resource: LabResource): void {
    this.resources.set([resource]);
    if (resource.hasChildren) {
      this.resourceService
        .getResourceChildren(resource.id)
        .subscribe((children) => this.resources.update((resources) => [...resources, ...children]));
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

  private loadMainView(obs: Observable<LabResourceView>): void {
    this._selectedView.set({ status: 'loading' });
    obs.subscribe({
      next: (view) => this._selectedView.set({ status: 'success', object: view }),
      error: (error) => this._selectedView.set({ status: 'error', error: error }),
    });
  }

  public updateResource(resource: LabResource): void {
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

  public addViewFromSpecs(resourceId: string, config: LabResourceViewSpecWithConfig): void {
    this.callView(
      this.callResourceView(resourceId, config.viewMethodName, config.viewConfigValues),
      config.viewName
    );
  }

  /**
   * Call and open the view in a portal, using the action service
   */
  public callView(view$: Observable<LabResourceView>, viewName: string): void {
    this.actionService.addAction(
      {
        type: this.actionType,
        text: { text: viewName, translateText: false },
        action: view$,
      },
      true
    );
  }

  public setMainView(view: LabResourceView): void {
    this._selectedView.set({ status: 'success', object: view });
    if (view.viewConfig) {
      this.queryParamHandler.mergeQueryParams({ viewId: view.viewConfig.id });
    }
  }

  private callResourceView(
    resourceId: string,
    methodName: string,
    configValues: PrConfigValues
  ): Observable<LabResourceView> {
    return this.resourceService.callResourceView(resourceId, methodName, configValues, true);
  }

  public undockCurrentView(): void {
    const view = this._selectedView();
    if (view.status === 'success') {
      this.openViewInPortal(view.object);
    }
  }

  public getSelectedResourceFavoriteViews(): LabViewConfigDatasource {
    return this.getFavoriteViews(this.selectedResourceId());
  }

  public minimizeView(view: LabResourceView): void {
    this._minimizedViews.update((views) => [
      ...views,
      {
        symbol: Symbol(),
        view: view,
      },
    ]);
  }

  public openMinimizedView(minimizedView: LabMinimizedView): void {
    this.openViewInPortal(minimizedView.view);
    this.deleteMinimizedView(minimizedView.symbol);
  }

  public deleteMinimizedView(minimizedViewId: symbol): void {
    this._minimizedViews.update((views) => {
      const index = views.findIndex((v) => v.symbol === minimizedViewId);
      if (index >= 0) {
        views.splice(index, 1);
      }
      return views;
    });
  }

  private getFavoriteViews(resourceId: string): LabViewConfigDatasource {
    if (this.favoriteViews[resourceId] == null) {
      this.favoriteViews[resourceId] = new FlEntityPaginatedDatasource(
        (page, pageSize) => this.viewConfigService.getByResource(resourceId, true, page, pageSize),
        10,
        true,
        true
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
      .subscribe((result: FlPortalActionResult<LabResourceView>) => this.openViewInPortal(result.result));
  }

  private openViewInPortal(labView: LabResourceView): void {
    const portalConfig: FlPortalConfig = this.portalService.configureAbsolutePortal(
      { centerHorizontally: '0', top: '0' },
      {
        disposeOnNavigation: true,
      }
    );

    const config: LabResourceViewPortalInput = {
      labView: labView,
      resourceState: this,
    };

    this.createPortal(LabResourceViewPortalComponent, portalConfig, config);
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

  public updateView(view: LabResourceView, viewOverlayRef: FlOverlayRef): void {
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
  public openConfigPortal(view: LabResourceViewSpec): void {
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
    config?: LabResourceViewSpecWithConfig,
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
  public updateViewConfig(viewConfig: LabViewConfig): void {
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

  ngOnDestroy(): void {
    this.viewPortalSubscription?.unsubscribe();
  }
}
