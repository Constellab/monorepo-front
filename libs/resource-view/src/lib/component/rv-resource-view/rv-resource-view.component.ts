import {
  Component,
  ComponentRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { RvResourceViewBase } from '../../model/rv-resource-view.class';

import { RvViewConfig } from '../../model/rv-view-config.class';
import { RvResourceViewDirective } from '../../model/rv-resource-view.directive';
import { RvResourceViewTypeInfo } from '../../model/rv-type-info.class';
import { RV_MODULE_CONFIG, RvResourceViewModuleConfig } from '../../model/rv-resource-view-module.config';
import { FlMenuDynamic } from '@monorepo/front-core-lib';
import { ClHelpService } from '@monorepo/core-lib';

@Component({
  selector: 'rv-resource-view',
  templateUrl: './rv-resource-view.component.html',
  styleUrls: ['./rv-resource-view.component.scss'],
})
export class RvResourceViewComponent implements OnInit, OnDestroy {
  @Input({ required: true }) set view(value: RvResourceViewBase) {
    this._view = value;
    if (this.isReady) {
      this.initView(value);
    }
  }

  _view: RvResourceViewBase;

  @Input() resourceId?: string;

  @Input() config?: RvViewConfig;

  /**
   * Provide to override the default module config
   */
  @Input() moduleConfigOverride: RvResourceViewModuleConfig;

  // if provided the view will support a right click. (only supported by view chart2d for now)
  @Input() contextMenuItems?: FlMenuDynamic[];

  @ViewChild('viewContainer', { static: true, read: ViewContainerRef }) viewContainer: ViewContainerRef;

  private isReady: boolean = false;

  private viewComponentRef: ComponentRef<RvResourceViewDirective>;

  private moduleConfig: RvResourceViewModuleConfig = inject(RV_MODULE_CONFIG);

  viewNotSupportedError: boolean = false;

  ngOnInit(): void {
    this.isReady = true;
    if (this._view) {
      this.initView(this._view);
    }
  }

  private initView(view: RvResourceViewBase): void {
    // wait for other input to be set
    setTimeout(async () => {
      this.destroyViewComponentRef();

      const viewTypeInfo: RvResourceViewTypeInfo = this.getModuleConfig().getViewTypeInfo(view.type);

      if (viewTypeInfo == null || viewTypeInfo.viewComponent == null) {
        this.viewNotSupportedError = true;
        return;
      }

      this.viewNotSupportedError = false;

      if (typeof viewTypeInfo.viewComponent === 'object') {
        const componentType = await viewTypeInfo.viewComponent.load();
        this.viewComponentRef = this.viewContainer.createComponent(componentType);
      } else {
        this.viewComponentRef = this.viewContainer.createComponent(viewTypeInfo.viewComponent);
      }
      this.viewComponentRef.instance.view = view;
      this.viewComponentRef.instance.resourceId = this.resourceId;
      this.viewComponentRef.instance.config = ClHelpService.deepClone(this.config);
      this.viewComponentRef.instance.contextMenuItems = this.contextMenuItems;
      this.viewComponentRef.instance.moduleConfig = this.getModuleConfig();
    }, 0);
  }

  private getModuleConfig(): RvResourceViewModuleConfig {
    return this.moduleConfigOverride ?? this.moduleConfig;
  }

  private destroyViewComponentRef(): void {
    this.viewComponentRef?.destroy();
    this.viewComponentRef = null;
  }

  ngOnDestroy(): void {
    this.destroyViewComponentRef();
  }
}
