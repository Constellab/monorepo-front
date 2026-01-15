import { Component, inject, Input, signal } from '@angular/core';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiResourceView, LiViewConfig, LiViewConfigService } from '@monorepo/lab-lib/li-core';
import {
  LiViewConfigActionsMenuComponent,
  LiViewConfigFavoriteComponent,
} from '@monorepo/lab-lib/li-view-config';
import { RvResourceViewModule, RvViewConfig } from '@monorepo/resource-view';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';

import { LiResourceDetailState } from '../../state/li-resource-detail.state';

@Component({
  selector: 'li-resource-view-detail',
  templateUrl: './li-resource-view-detail.component.html',
  styleUrls: ['./li-resource-view-detail.component.scss'],
  imports: [
    FlSectionModule,
    TdTechnicalDocModule,
    FlFormModule,
    LiViewConfigFavoriteComponent,
    RvResourceViewModule,
    LiViewConfigActionsMenuComponent,
  ],
})
export class LiResourceViewDetailComponent {
  private viewConfigService = inject(LiViewConfigService);
  private resourceState = inject(LiResourceDetailState, { optional: true });

  headerHidden = this.resourceState?.isHeaderHidden ?? signal(false);

  @Input({ required: true }) labView: LiResourceView;

  get viewConfig(): RvViewConfig {
    return {
      methodName: this.labView.viewConfig.viewName,
      configValues: this.labView.viewConfig.configValues,
    };
  }

  onUpdate(viewConfig: LiViewConfig): void {
    this.labView.viewConfig = viewConfig;
    if (this.resourceState) {
      this.resourceState.updateViewConfig(viewConfig);
    }
  }

  updateTitle(title: string): void {
    if (this.labView.viewConfig == null) return;
    this.viewConfigService
      .updateTitle(this.labView.viewConfig.id, title)
      .subscribe((viewConfig) => this.onUpdate(viewConfig));
  }
}
