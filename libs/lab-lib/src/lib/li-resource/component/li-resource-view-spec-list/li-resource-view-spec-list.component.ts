import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject,Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import {
  LiResourceService,
  LiResourceViewSpec,
  LiResourceViewSpecWithConfig,
} from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { LiViewConfigurerState } from '../../state/li-view-configurer-state.service';
import { LiResourceViewSpecCardComponent } from '../li-resource-view-spec-card/li-resource-view-spec-card.component';

@Component({
  selector: 'li-resource-view-spec-list',
  templateUrl: './li-resource-view-spec-list.component.html',
  styleUrls: ['./li-resource-view-spec-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LiViewConfigurerState],
  imports: [
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    LiResourceViewSpecCardComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class LiResourceViewSpecListComponent {
  private resourceService = inject(LiResourceService);
  private viewConfigurerState = inject(LiViewConfigurerState);

  @Input() set resourceTypingName(resourceTypingName: string) {
    this._resourceTypingName = resourceTypingName;
    if (resourceTypingName) {
      this.viewSpecs$ = this.resourceService.getResourceViewsList(resourceTypingName);
    }
  }

  @Output() viewConfigured: EventEmitter<LiResourceViewSpecWithConfig> = new EventEmitter();

  private _resourceTypingName: string;

  viewSpecs$: Observable<LiResourceViewSpec[]>;

  // prepare the data and open the view configuration portal
  openConfigPortal(view: LiResourceViewSpec): void {
    this.viewConfigurerState
      .openConfigPortal(
        view.methodName,
        view.getName(),
        view.hasConfigSpecs,
        null,
        this._resourceTypingName,
        view.style
      )
      .subscribe((config) => this.callView(config));
  }

  private callView(config: LiResourceViewSpecWithConfig): void {
    if (config == null) return;
    this.viewConfigured.next(config);
  }
}
