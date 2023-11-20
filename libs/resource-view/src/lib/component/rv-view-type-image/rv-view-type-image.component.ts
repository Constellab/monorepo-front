import {Component, Input, OnInit} from '@angular/core';
import {
  rvDefaultViewTypeIcon,
  rvDefaultViewTypeInfos,
  RvResourceViewType,
  RvResourceViewTypeInfo
} from '@monorepo/resource-view';

@Component({
  selector: 'rv-view-type-image',
  templateUrl: './rv-view-type-image.component.html',
  styleUrls: ['./rv-view-type-image.component.scss'],
})
export class RvViewTypeImageComponent implements OnInit {
  @Input() viewType: RvResourceViewType | string;

  @Input() size: string = '1em';

  @Input() viewTypesInfos: Record<string, RvResourceViewTypeInfo> = rvDefaultViewTypeInfos;

  viewTypeInfo: RvResourceViewTypeInfo;
  constructor() {
  }

  ngOnInit(): void {
    this.viewTypeInfo = this.viewTypesInfos[this.viewType];
  }

  protected readonly rvDefaultViewTypeIcon = rvDefaultViewTypeIcon;
}
