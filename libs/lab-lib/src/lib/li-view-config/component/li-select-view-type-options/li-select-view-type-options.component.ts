import { AsyncPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';
import { LiViewConfigService, LiViewType } from '@monorepo/lab-lib/li-core';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { Observable } from 'rxjs';

@Component({
  selector: 'li-select-view-type-options',
  templateUrl: './li-select-view-type-options.component.html',
  styleUrls: ['./li-select-view-type-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatOption, TdTechnicalDocModule, AsyncPipe],
})
export class LiSelectViewTypeOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit
{
  private select: MatSelect;
  private viewConfigService = inject(LiViewConfigService);

  viewTypes$: Observable<LiViewType[]>;

  constructor() {
    const select = inject(MatSelect, { host: true });

    super(select);

    this.select = select;
  }

  ngOnInit(): void {
    this.viewTypes$ = this.viewConfigService.getViewTypes();
    this.overrideCompareWith(this.select, (o1: LiViewType, o2: LiViewType) => o1?.type === o2?.type);
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
