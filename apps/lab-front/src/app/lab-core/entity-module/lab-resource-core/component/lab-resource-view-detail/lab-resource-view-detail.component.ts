import { Component, Input, inject } from '@angular/core';
import { LabViewConfig } from '../../../../model/entities/resource/lab-view-config.entity';
import { LabResourceView } from '../../../../model/entities/resource/lab-resource-view.entity';
import { RvViewConfig } from '@monorepo/resource-view';
import { LabViewConfigService } from '../../../../entity-service/lab-view-config.service';
import { LabResourceDetailState } from '../../state/lab-resource-detail.state';

@Component({
  selector: 'lab-resource-view-detail',
  templateUrl: './lab-resource-view-detail.component.html',
  styleUrls: ['./lab-resource-view-detail.component.scss'],
  standalone: false,
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
