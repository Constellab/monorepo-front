import { Component, Input } from '@angular/core';
import { CaGroup } from '../../../../model/entities/ca-group.entity';

/**
 * Component to show the type of group along with label
 */
@Component({
  selector: 'ca-group-inline',
  templateUrl: './ca-group-inline.component.html',
  styleUrls: ['./ca-group-inline.component.scss'],
})
export class CaGroupInlineComponent {
  @Input({ required: true }) group: CaGroup;

  @Input() disableUserPortal: boolean = false;
}
