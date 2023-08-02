import {Component, computed, effect} from '@angular/core';
import {LabResourceViewSpec} from '../../../../model/entities/resource/lab-resource-view.entity';
import {Observable, of} from 'rxjs';
import {LabResourceService} from '../../../../entity-service/lab-resource.service';
import {LabResourceDetailState} from '../../state/lab-resource-detail.state';
import {FlOverlayRef} from '@monorepo/front-core-lib';
import {LabViewConfig, LabViewConfigDatasource} from '../../../../model/entities/resource/lab-view-config.entity';

@Component({
  selector: 'lab-resource-view-specs-list-portal',
  templateUrl: './lab-resource-view-specs-list-portal.component.html',
  styleUrls: ['./lab-resource-view-specs-list-portal.component.scss'],
})
export class LabResourceViewSpecsListPortalComponent {

  viewSpecs$: Observable<LabResourceViewSpec[]>;
  favoritesViews$: LabViewConfigDatasource = this.state.getSelectedResourceFlaggedViews();

  constructor(private state: LabResourceDetailState,
              private resourceService: LabResourceService,
              private overlay: FlOverlayRef) {
    // use a computed to update the view specs only when typing changes
    const typingSignal = computed(() => this.state.selectedResource()?.resourceTypingName ?? null);
    effect(() => {
      const typing = typingSignal();
      if (typing) {
        this.viewSpecs$ = this.resourceService.getResourceViewsList(typing);
      } else {
        this.viewSpecs$ = of([]);
      }
    });
  }

  openFavoriteView(viewConfig: LabViewConfig): void {
    this.state.addViewFromConfig(viewConfig.id, viewConfig.title);
  }

  // prepare the data and open the view configuration portal
  openConfigPortal(view: LabResourceViewSpec): void {
    this.state.openConfigPortal(view);
    this.overlay.dispose();
  }

}
