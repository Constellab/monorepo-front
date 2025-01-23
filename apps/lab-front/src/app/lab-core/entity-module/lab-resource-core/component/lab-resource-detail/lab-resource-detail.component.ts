import { Component, inject, Input, OnInit, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { LabResourceDetailState } from '../../state/lab-resource-detail.state';
import { LabViewConfigurerState } from '../../state/lab-view-configurer-state.service';
import { FlQueryParamHandler } from '@monorepo/front-core-lib/fl-core';
import { LabResourceChildrenTabsComponent } from '../lab-resource-children-tabs/lab-resource-children-tabs.component';
import { LabResourceDetailHeaderComponent } from '../lab-resource-detail-header/lab-resource-detail-header.component';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LabResourceViewDetailComponent } from '../lab-resource-view-detail/lab-resource-view-detail.component';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { LabResourceDetailMinimizedViewsComponent } from '../lab-resource-detail-minimized-views/lab-resource-detail-minimized-views.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-resource-detail',
  templateUrl: './lab-resource-detail.component.html',
  styleUrls: ['./lab-resource-detail.component.scss'],
  providers: [LabResourceDetailState, LabViewConfigurerState, FlQueryParamHandler],
  imports: [
    LabResourceChildrenTabsComponent,
    LabResourceDetailHeaderComponent,
    FlSectionModule,
    LabResourceViewDetailComponent,
    MatIconButton,
    MatTooltip,
    MatIcon,
    LabResourceDetailMinimizedViewsComponent,
    TranslatePipe,
  ],
})
export class LabResourceDetailComponent implements OnInit {
  private state = inject(LabResourceDetailState);

  @Input() resourceId: string | Observable<string>;

  /**
   * FullPage : resource detail page
   * FullDialog : resource detail dialog
   * Dense : resource detail in a dense page (task dashboard)
   *
   */
  @Input() displayMode: 'fullPage' | 'fullDialog' | 'dense' = 'fullPage';

  hasChildren: Signal<boolean> = this.state.hasChildren;
  selectedView = this.state.selectedView;

  ngOnInit(): void {
    if (this.resourceId instanceof Observable) {
      this.resourceId.subscribe((id) => this.onNewResourceId(id));
    } else {
      this.onNewResourceId(this.resourceId);
    }
  }

  private onNewResourceId(id: string): void {
    if (id == null) return;
    this.state.init(id, this.displayMode === 'fullPage');
  }

  undockView(): void {
    this.state.undockCurrentView();
  }
}
