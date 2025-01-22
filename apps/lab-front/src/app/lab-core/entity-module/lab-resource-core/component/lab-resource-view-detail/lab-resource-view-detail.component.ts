import { Component, Input, inject } from '@angular/core';
import { LabViewConfig } from '../../../../model/entities/resource/lab-view-config.entity';
import { LabResourceView } from '../../../../model/entities/resource/lab-resource-view.entity';
import { RvViewConfig } from '@monorepo/resource-view';
import { LabViewConfigService } from '../../../../entity-service/lab-view-config.service';
import { LabResourceDetailState } from '../../state/lab-resource-detail.state';
import { FlSectionModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { TdTechnicalDocModule } from '../../../../../../../../../libs/technical-doc/src/lib/td-technical-doc.module';
import { FlFormModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { LabViewConfigFavoriteComponent } from '../../../lab-view-config-core/component/lab-view-config-favorite/lab-view-config-favorite.component';
import { RvResourceViewModule } from '../../../../../../../../../libs/resource-view/src/lib/rv-resource-view.module';
import { LabViewConfigActionsMenuComponent } from '../../../lab-view-config-core/component/lab-view-config-actions-menu/lab-view-config-actions-menu.component';

@Component({
  selector: 'lab-resource-view-detail',
  templateUrl: './lab-resource-view-detail.component.html',
  styleUrls: ['./lab-resource-view-detail.component.scss'],
  imports: [
    FlSectionModule,
    TdTechnicalDocModule,
    FlFormModule,
    LabViewConfigFavoriteComponent,
    RvResourceViewModule,
    LabViewConfigActionsMenuComponent,
  ],
})
export class LabResourceViewDetailComponent {
  private viewConfigService = inject(LabViewConfigService);
  private resourceState = inject(LabResourceDetailState, { optional: true });

  @Input({ required: true }) labView: LabResourceView;

  get viewConfig(): RvViewConfig {
    return {
      methodName: this.labView.viewConfig.viewName,
      configValues: this.labView.viewConfig.configValues,
    };
  }

  onUpdate(viewConfig: LabViewConfig): void {
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
