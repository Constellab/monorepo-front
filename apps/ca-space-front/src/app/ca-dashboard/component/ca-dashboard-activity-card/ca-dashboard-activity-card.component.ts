import { Component, Input, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-dashboard-activity-card',
  templateUrl: './ca-dashboard-activity-card.component.html',
  styleUrls: ['./ca-dashboard-activity-card.component.scss'],
  imports: [TranslatePipe],
})
export class CaDashboardActivityCardComponent {
  @Input() activityNumber: number;

  @Input() activityText: string;
}
