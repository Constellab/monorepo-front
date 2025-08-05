import { Component, OnInit } from '@angular/core';

import { RvResourceViewMulti } from '../../model/rv-resource-view.class';
import { RvResourceViewDirective } from '../../model/rv-resource-view.directive';

@Component({
  selector: 'rv-view-multi-views',
  templateUrl: './rv-view-multi-views.component.html',
  styleUrls: ['./rv-view-multi-views.component.scss'],
  standalone: false,
})
export class RvViewMultiViewsComponent extends RvResourceViewDirective<RvResourceViewMulti> {}
