import { AsyncPipe } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { FlOverlayRef, FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiResourceDetailState } from '../../state/li-resource-detail.state';
import {
  LiResourceService,
  LiResourceViewSpec,
  LiViewConfig,
  LiViewConfigDatasource,
} from '@monorepo/lab-lib/li-core';
import { LiResourceViewSpecCardComponent } from '../li-resource-view-spec-card/li-resource-view-spec-card.component';
import { MatIcon } from '@angular/material/icon';
import { Observable, of } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-resource-available-views-portal',
  templateUrl: './li-resource-available-views-portal.component.html',
  styleUrls: ['./li-resource-available-views-portal.component.scss'],
  imports: [
    FlPortalModule,
    FlSectionModule,
    FlTextIconModule,
    MatIcon,
    LiResourceViewSpecCardComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class LiResourceAvailableViewsPortalComponent {
  private state = inject(LiResourceDetailState);
  private resourceService = inject(LiResourceService);
  private overlay = inject(FlOverlayRef);

  viewSpecs$: Observable<LiResourceViewSpec[]>;
  favoritesViews$: LiViewConfigDatasource = this.state.getSelectedResourceFavoriteViews();

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

  openFavoriteView(viewConfig: LiViewConfig): void {
    this.state.addViewFromConfig(viewConfig.id, viewConfig.title);
  }

  // prepare the data and open the view configuration portal
  openConfigPortal(view: LiResourceViewSpec): void {
    this.state.openConfigPortal(view);
    this.overlay.dispose();
  }
}
