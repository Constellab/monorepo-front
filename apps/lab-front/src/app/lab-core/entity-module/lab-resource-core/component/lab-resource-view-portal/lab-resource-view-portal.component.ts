import { Component, inject } from '@angular/core';
import { LabResourceView } from '../../../../model/entities/resource/lab-resource-view.entity';
import { FL_PORTAL_DATA, FlOverlayRef, FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { RvViewConfig } from '@monorepo/resource-view';
import { LabViewConfig } from '../../../../model/entities/resource/lab-view-config.entity';
import { LabResourceDetailState } from '../../state/lab-resource-detail.state';
import { LabViewConfigService } from '../../../../entity-service/lab-view-config.service';
import { FlResizeModule } from '@monorepo/front-core-lib/fl-resize';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { LabViewConfigFavoriteComponent } from '../../../lab-view-config-core/component/lab-view-config-favorite/lab-view-config-favorite.component';
import { RvResourceViewModule } from '@monorepo/resource-view';
import { LabViewConfigActionsMenuComponent } from '../../../lab-view-config-core/component/lab-view-config-actions-menu/lab-view-config-actions-menu.component';
import { MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

export interface LabResourceViewPortalInput {
  labView: LabResourceView;
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
  resourceState?: LabResourceDetailState;
}

/**
 * Portal to show a resource view
 */
@Component({
  selector: 'lab-resource-view-portal',
  templateUrl: './lab-resource-view-portal.component.html',
  styleUrls: ['./lab-resource-view-portal.component.scss'],
  imports: [
    FlPortalModule,
    FlResizeModule,
    TdTechnicalDocModule,
    FlFormModule,
    LabViewConfigFavoriteComponent,
    RvResourceViewModule,
    LabViewConfigActionsMenuComponent,
    MatMenuItem,
    MatIcon,
    MatIconButton,
    MatTooltip,
    TranslatePipe,
  ],
})
export class LabResourceViewPortalComponent {
  private input = inject<LabResourceViewPortalInput>(FL_PORTAL_DATA);
  private overlayRef = inject(FlOverlayRef);
  private viewConfigService = inject(LabViewConfigService);

  labView: LabResourceView;
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

  onUpdate(viewConfig: LabViewConfig): void {
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

  minimizeView(): void {
    if (this.input.resourceState) {
      this.input.resourceState.minimizeView(this.labView);
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
