import { Component, Input } from '@angular/core';

import { FlDynamicFieldAbstractDirective } from '../../model/fl-dynamic-field-abstract.directive';

@Component({
  selector: 'fl-dynamic-field-list',
  templateUrl: './fl-dynamic-field-list.component.html',
  styleUrls: ['./fl-dynamic-field-list.component.scss'],
  standalone: false,
})
export class FlDynamicFieldListComponent extends FlDynamicFieldAbstractDirective {
  @Input() prefix: string;

  @Input() suffix: string;
}
