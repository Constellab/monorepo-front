import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuItem } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FL_PORTAL_DATA, FlOverlayRef, FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlResizeModule } from '@monorepo/front-core-lib/fl-resize';
import { LiResourceView, LiViewConfig, LiViewConfigService } from '@monorepo/lab-lib/li-core';
import {
  LiViewConfigActionsMenuComponent,
  LiViewConfigFavoriteComponent,
} from '@monorepo/lab-lib/li-view-config';
import { RvResourceViewModule, RvViewConfig } from '@monorepo/resource-view';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

import { LiResourceDetailState } from '../../state/li-resource-detail.state';

export interface LiResourceViewPortalInput {
  labView: LiResourceView;
  /**
   * Pass context menu items to the view
   */
  contextMenuItems?: FlMenuDynamic[];

  /**
   * Override the edit view button action (to show a custom form for view config)
   */
  editView?: () => void;

  /**
   * Optional resource state to update the view config
   */
  resourceState?: LiResourceDetailState;
}

/**
 * Portal to show a resource view
 */
@Component({
  selector: 'li-resource-view-portal',
  templateUrl: './li-resource-view-portal.component.html',
  styleUrls: ['./li-resource-view-portal.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlPortalModule,
    FlResizeModule,
    TdTechnicalDocModule,
    FlFormModule,
    LiViewConfigFavoriteComponent,
    RvResourceViewModule,
    LiViewConfigActionsMenuComponent,
    MatMenuItem,
    MatIcon,
    MatIconButton,
    MatTooltip,
    TranslatePipe,
  ],
})
export class LiResourceViewPortalComponent {
  private input = inject<LiResourceViewPortalInput>(FL_PORTAL_DATA);
  private overlayRef = inject(FlOverlayRef);
  private viewConfigService = inject(LiViewConfigService);

  labView: LiResourceView;
  rvConfig: RvViewConfig;
  contextMenuItems?: FlMenuDynamic[];

  width: string;
  height: string;

  editTitle: boolean = false;

  constructor() {
    const input = this.input;

    this.labView = input.labView;
    this.contextMenuItems = input.contextMenuItems;

    if (input.labView.viewConfig) {
      this.rvConfig = {
        methodName: input.labView.viewConfig.viewName,
        configValues: input.labView.viewConfig.configValues,
      };
    }

    // do not define the container, the heat map defines it itself
    if (input.labView.viewType === 'heatmap-view') {
      this.width = null;
      this.height = null;
      // big portal for the multi view
    } else if (input.labView.view.type === 'multi-view') {
      this.width = 'min(1000px, 90vw)';
      this.height = 'min(1000px, 90vh)';
    } else {
      this.width = '660px';
      this.height = '600px';
    }
  }

  onUpdate(viewConfig: LiViewConfig): void {
    this.labView.viewConfig = viewConfig;
    if (this.input.resourceState) {
      this.input.resourceState.updateViewConfig(viewConfig);
    }
  }

  get resourceStateAccessible(): boolean {
    return this.input.resourceState != null;
  }

  dockView(): void {
    if (this.input.resourceState) {
      this.input.resourceState.setMainView(this.labView);
      this.overlayRef.dispose();
    }
  }

  updateView(): void {
    if (this.input.editView) {
      this.input.editView();
      return;
    }
    if (this.input.resourceState) {
      this.input.resourceState.updateView(this.labView, this.overlayRef);
    }
  }

  updateTitle(title: string): void {
    if (this.labView.viewConfig == null) return;
    this.viewConfigService
      .updateTitle(this.labView.viewConfig.id, title)
      .subscribe((viewConfig) => this.onUpdate(viewConfig));
  }
}
