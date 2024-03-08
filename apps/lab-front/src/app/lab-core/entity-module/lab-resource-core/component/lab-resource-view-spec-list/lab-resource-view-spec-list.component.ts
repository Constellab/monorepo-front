import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {LabResourceService} from '../../../../entity-service/lab-resource.service';
import {Observable} from 'rxjs';
import {
  LabResourceViewSpec,
  LabResourceViewSpecWithConfig
} from '../../../../model/entities/resource/lab-resource-view.entity';
import {LabViewConfigurerState} from '../../state/lab-view-configurer-state.service';

@Component({
  selector: 'lab-resource-view-spec-list',
  templateUrl: './lab-resource-view-spec-list.component.html',
  styleUrls: ['./lab-resource-view-spec-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LabViewConfigurerState]
})
export class LabResourceViewSpecListComponent {

  @Input() set resourceTypingName(resourceTypingName: string) {
    this._resourceTypingName = resourceTypingName;
    if (resourceTypingName) {
      this.viewSpecs$ = this.resourceService.getResourceViewsList(resourceTypingName);
    }
  }

  @Output() viewConfigured: EventEmitter<LabResourceViewSpecWithConfig> = new EventEmitter();

  private _resourceTypingName: string;

  viewSpecs$: Observable<LabResourceViewSpec[]>;

  constructor(private resourceService: LabResourceService,
              private viewConfigurerState: LabViewConfigurerState) {
  }

  // prepare the data and open the view configuration portal
  openConfigPortal(view: LabResourceViewSpec): void {
    this.viewConfigurerState.openConfigPortal(view.methodName, view.getName(), view.hasConfigSpecs, null,
      this._resourceTypingName, view.style).subscribe(
      config => this.callView(config)
    );
  }

  private callView(config: LabResourceViewSpecWithConfig): void {
    if (config == null) return;
    this.viewConfigured.next(config);
  }

}
