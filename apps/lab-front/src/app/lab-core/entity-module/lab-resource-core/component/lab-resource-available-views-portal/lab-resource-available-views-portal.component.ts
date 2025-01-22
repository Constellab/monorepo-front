import { Component, computed, effect, inject } from '@angular/core';
import { LabResourceViewSpec } from '../../../../model/entities/resource/lab-resource-view.entity';
import { Observable, of } from 'rxjs';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import { LabResourceDetailState } from '../../state/lab-resource-detail.state';
import { FlOverlayRef } from '@monorepo/front-core-lib';
import {
  LabViewConfig,
  LabViewConfigDatasource,
} from '../../../../model/entities/resource/lab-view-config.entity';
import { FlPortalModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-portal/fl-portal.module';
import { FlSectionModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { LabResourceViewSpecCardComponent } from '../lab-resource-view-spec-card/lab-resource-view-spec-card.component';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-resource-available-views-portal',
  templateUrl: './lab-resource-available-views-portal.component.html',
  styleUrls: ['./lab-resource-available-views-portal.component.scss'],
  imports: [
    FlPortalModule,
    FlSectionModule,
    FlTextIconModule,
    MatIcon,
    LabResourceViewSpecCardComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class LabResourceAvailableViewsPortalComponent {
  private state = inject(LabResourceDetailState);
  private resourceService = inject(LabResourceService);
  private overlay = inject(FlOverlayRef);

  viewSpecs$: Observable<LabResourceViewSpec[]>;
  favoritesViews$: LabViewConfigDatasource = this.state.getSelectedResourceFavoriteViews();

  constructor() {
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
