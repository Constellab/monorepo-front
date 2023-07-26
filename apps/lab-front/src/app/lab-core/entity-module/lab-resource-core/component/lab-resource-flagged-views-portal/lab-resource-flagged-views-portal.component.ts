import {Component} from '@angular/core';
import {LabResourceDetailState} from '../../state/lab-resource-detail.state';
import {FlOverlayRef, FlTableColumnStatic} from '@monorepo/front-core-lib';
import {LabViewConfig, LabViewConfigDatasource} from '../../../../model/entities/resource/lab-view-config.entity';

/**
 * Component in the resource detail to show the list of flagged views in a portal
 */
@Component({
  selector: 'lab-resource-flagged-views-portal',
  templateUrl: './lab-resource-flagged-views-portal.component.html',
  styleUrls: ['./lab-resource-flagged-views-portal.component.scss'],
})
export class LabResourceFlaggedViewsPortalComponent {

  resourceViews: LabViewConfigDatasource = this.state.getSelectedResourceFlaggedViews();

  columns: FlTableColumnStatic<LabViewConfig>[] = ['title', 'lastModifiedAt'];

  constructor(private state: LabResourceDetailState,
              private overlayRef: FlOverlayRef) {
  }

  showView(viewConfig: LabViewConfig): void {
    this.state.addViewFromConfig(viewConfig.id, viewConfig.title);
    this.overlayRef.dispose();
  }
}
