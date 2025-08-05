import { Component, Input } from '@angular/core';
import { DateTime } from 'luxon';

import { FlUser } from '../../model/fl-user.class';

@Component({
  selector: 'fl-creation-info',
  templateUrl: './fl-creation-info.component.html',
  styleUrls: ['./fl-creation-info.component.scss'],
  standalone: false,
})
export class FlCreationInfoComponent {
  @Input() user: FlUser;
  @Input() date: DateTime;
}
