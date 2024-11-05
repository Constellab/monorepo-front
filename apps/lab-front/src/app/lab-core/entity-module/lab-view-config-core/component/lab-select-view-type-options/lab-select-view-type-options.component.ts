import { AfterViewInit, Component, Host, OnInit } from '@angular/core';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib';
import { MatSelect } from '@angular/material/select';
import { Observable } from 'rxjs';
import { LabViewType } from '../../../../model/entities/resource/lab-view-config.entity';
import { LabViewConfigService } from '../../../../entity-service/lab-view-config.service';

@Component({
  selector: 'lab-select-view-type-options',
  templateUrl: './lab-select-view-type-options.component.html',
  styleUrls: ['./lab-select-view-type-options.component.scss'],
})
export class LabSelectViewTypeOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit
{
  viewTypes$: Observable<LabViewType[]>;

  constructor(
    @Host() private select: MatSelect,
    private viewConfigService: LabViewConfigService
  ) {
    super(select);
  }

  ngOnInit(): void {
    this.viewTypes$ = this.viewConfigService.getViewTypes();
    this.overrideCompareWith(this.select, (o1: LabViewType, o2: LabViewType) => o1?.type === o2?.type);
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
