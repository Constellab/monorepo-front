import { Component, inject, Input, OnInit, Signal } from '@angular/core';
import { FlQueryParamHandler } from '@monorepo/front-core-lib/fl-core';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiResourceChildrenTabsComponent } from '../li-resource-children-tabs/li-resource-children-tabs.component';
import { LiResourceDetailHeaderComponent } from '../li-resource-detail-header/li-resource-detail-header.component';
import { LiResourceDetailState } from '../../state/li-resource-detail.state';
import { LiResourceViewDetailComponent } from '../li-resource-view-detail/li-resource-view-detail.component';
import { LiViewConfigurerState } from '../../state/li-view-configurer-state.service';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-resource-detail',
  templateUrl: './li-resource-detail.component.html',
  styleUrls: ['./li-resource-detail.component.scss'],
  providers: [LiResourceDetailState, LiViewConfigurerState, FlQueryParamHandler],
  imports: [
    LiResourceChildrenTabsComponent,
    LiResourceDetailHeaderComponent,
    FlSectionModule,
    LiResourceViewDetailComponent,
    MatIconButton,
    MatTooltip,
    MatIcon,
    TranslatePipe,
  ],
})
export class LiResourceDetailComponent implements OnInit {
  private state = inject(LiResourceDetailState);

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
