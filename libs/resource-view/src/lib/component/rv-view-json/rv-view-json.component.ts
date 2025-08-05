import { Component, OnInit } from '@angular/core';

import { RvResourceViewJson } from '../../model/rv-resource-view.class';
import { RvResourceViewDirective } from '../../model/rv-resource-view.directive';

/**
 * Display the resource json
 */
@Component({
  selector: 'rv-view-json',
  templateUrl: './rv-view-json.component.html',
  styleUrls: ['./rv-view-json.component.scss'],
  standalone: false,
})
export class RvViewJsonComponent extends RvResourceViewDirective<RvResourceViewJson> {}
