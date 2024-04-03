import {Component, Input} from '@angular/core';
import {LabResourceService} from '../../../../../lab-core/entity-service/lab-resource.service';
import {LabResourceViewData} from '../../../../../lab-core/model/entities/resource/lab-resource-view.entity';
import {Observable} from 'rxjs';
import {RvViewConfig} from '@monorepo/resource-view';
import {TeElementBlockDirective} from '@monorepo/text-editor';

/**
 * Component used in the Text editor to show a resource view
 */
@Component({
  selector: 'lab-report-content-view',
  templateUrl: './lab-report-content-view.component.html',
  styleUrls: ['./lab-report-content-view.component.scss']
})
export class LabReportContentViewComponent extends TeElementBlockDirective {

  @Input() resourceId: string;

  @Input() viewConfig: RvViewConfig;

  @Input() viewTitle: string;

  @Input() caption: string;

  view$: Observable<LabResourceViewData>;

  constructor(private resourceService: LabResourceService) {
    super();
  }


  public setInputs(resourceId: string, viewTitle: string, caption: string, viewConfig: RvViewConfig): void {
    this.resourceId = resourceId;
    this.viewTitle = viewTitle;
    this.caption = caption;
    this.viewConfig = viewConfig;

    if (this.resourceId && this.viewConfig) {
      this.view$ = this.resourceService.callResourceViewData(this.resourceId, this.viewConfig.methodName,
        this.viewConfig.configValues);
    }
  }
}
