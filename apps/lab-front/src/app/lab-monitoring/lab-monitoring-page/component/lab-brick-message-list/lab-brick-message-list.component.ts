import { Component, Input } from '@angular/core';
import { LabBrickMessage } from '../../../../lab-core/model/entities/lab-brick.entity';
import { FlSectionModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { FlStatusModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-status/fl-status.module';
import { MatDivider } from '@angular/material/divider';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to display the messages of a brick
 */
@Component({
  selector: 'lab-brick-message-list',
  templateUrl: './lab-brick-message-list.component.html',
  styleUrls: ['./lab-brick-message-list.component.scss'],
  imports: [FlSectionModule, FlStatusModule, MatDivider, TranslatePipe],
})
export class LabBrickMessageListComponent {
  @Input() messages: LabBrickMessage[];
}
