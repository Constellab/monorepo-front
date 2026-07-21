import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { LiBrickMessage } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to display the messages of a brick
 */
@Component({
  selector: 'lab-brick-message-list',
  templateUrl: './lab-brick-message-list.component.html',
  styleUrls: ['./lab-brick-message-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlSectionModule, FlStatusModule, MatDivider, TranslatePipe],
})
export class LabBrickMessageListComponent {
  @Input() messages: LiBrickMessage[];
}
