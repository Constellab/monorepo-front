import { Component, Input, OnInit, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { LabResourceDetailState } from '../../state/lab-resource-detail.state';
import { LabViewConfigurerState } from '../../state/lab-view-configurer-state.service';

@Component({
    selector: 'lab-resource-detail',
    templateUrl: './lab-resource-detail.component.html',
    styleUrls: ['./lab-resource-detail.component.scss'],
    providers: [LabResourceDetailState, LabViewConfigurerState],
    standalone: false
})
export class LabResourceDetailComponent implements OnInit {
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

  constructor(private state: LabResourceDetailState) {}

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
