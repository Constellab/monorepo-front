import { Component, Input } from '@angular/core';
import { DateTime } from 'luxon';
import { FlUser } from '../../model/fl-user.class';

/**
 * Simple component to show the last modification info
 */
@Component({
  selector: 'fl-last-modification-info',
  templateUrl: './fl-last-modification-info.component.html',
  styleUrls: ['./fl-last-modification-info.component.scss'],
})
export class FlLastModificationInfoComponent {
  @Input() user: FlUser;
  @Input() date: DateTime;
}
