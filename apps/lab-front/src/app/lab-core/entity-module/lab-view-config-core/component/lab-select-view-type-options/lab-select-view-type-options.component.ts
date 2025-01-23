import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';
import { MatSelect } from '@angular/material/select';
import { Observable } from 'rxjs';
import { LabViewType } from '../../../../model/entities/resource/lab-view-config.entity';
import { LabViewConfigService } from '../../../../entity-service/lab-view-config.service';
import { MatOption } from '@angular/material/core';
import { TdTechnicalDocModule } from '../../../../../../../../../libs/technical-doc/src/lib/td-technical-doc.module';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'lab-select-view-type-options',
  templateUrl: './lab-select-view-type-options.component.html',
  styleUrls: ['./lab-select-view-type-options.component.scss'],
  imports: [MatOption, TdTechnicalDocModule, AsyncPipe],
})
export class LabSelectViewTypeOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit
{
  private select: MatSelect;
  private viewConfigService = inject(LabViewConfigService);

  viewTypes$: Observable<LabViewType[]>;

  constructor() {
    const select = inject(MatSelect, { host: true });

    super(select);

    this.select = select;
  }

  ngOnInit(): void {
    this.viewTypes$ = this.viewConfigService.getViewTypes();
    this.overrideCompareWith(this.select, (o1: LabViewType, o2: LabViewType) => o1?.type === o2?.type);
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
