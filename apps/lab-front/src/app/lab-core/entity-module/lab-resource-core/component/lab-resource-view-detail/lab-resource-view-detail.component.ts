import {Component, Input, OnInit, Optional} from '@angular/core';
import {LabViewConfig} from '../../../../model/entities/resource/lab-view-config.entity';
import {LabResourceView} from '../../../../model/entities/resource/lab-resource-view.entity';
import {RvViewConfig} from '@monorepo/resource-view';
import {FlTagDatasource} from '@monorepo/front-core-lib';
import {LabViewConfigService} from '../../../../entity-service/lab-view-config.service';
import {LabResourceDetailState} from '../../state/lab-resource-detail.state';
import {labConstResourceViewTypeInfos} from '../../../../model/entities/resource/lab-resource-view-type.class';
import {LabTagService} from '../../../../entity-service/lab-tag.service';

@Component({
  selector: 'lab-resource-view-detail',
  templateUrl: './lab-resource-view-detail.component.html',
  styleUrls: ['./lab-resource-view-detail.component.scss']
})
export class LabResourceViewDetailComponent implements OnInit {

  @Input() labView: LabResourceView;

  @Input() showResourceName: boolean = true;

  tags: FlTagDatasource;

  constructor(private viewConfigService: LabViewConfigService,
              private tagService: LabTagService,
              @Optional() private resourceState: LabResourceDetailState) {
  }

  ngOnInit(): void {
    if (this.labView.viewConfig) {
      this.tags = this.tagService.getEntityTagsDatasource('VIEW', this.labView.viewConfig.id);
    }
  }


  get viewConfig(): RvViewConfig {
    return {
      methodName: this.labView.viewConfig.viewName,
      configValues: this.labView.viewConfig.configValues,
    };
  }

  onUpdate(viewConfig: LabViewConfig): void {
    this.labView.viewConfig = viewConfig;
    if (this.resourceState) {
      this.resourceState.updateViewConfig(viewConfig);
    }
  }

  updateTitle(title: string): void {
    if (this.labView.viewConfig == null) return;
    this.viewConfigService.updateTitle(this.labView.viewConfig.id, title).subscribe(
      viewConfig => this.onUpdate(viewConfig)
    );
  }

  protected readonly labConstResourceViewTypeInfos = labConstResourceViewTypeInfos;
}
