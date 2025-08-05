import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';

import { CaStats } from '../../../ca-core/model/entities/ca-stats.class';
import { CaStatsService } from '../../../ca-core/service-api/ca-stats.service';
import { CaDashboardActivityCardComponent } from '../ca-dashboard-activity-card/ca-dashboard-activity-card.component';

@Component({
  selector: 'ca-dashboard-my-activity',
  templateUrl: './ca-dashboard-my-activity.component.html',
  styleUrls: ['./ca-dashboard-my-activity.component.scss'],
  imports: [FlCardModule, FlTextIconModule, MatIcon, CaDashboardActivityCardComponent, TranslatePipe],
})
export class CaDashboardMyActivityComponent implements OnInit {
  private statsService = inject(CaStatsService);

  stats: CaStats;

  ngOnInit(): void {
    this.statsService.getStats().subscribe((stats) => (this.stats = stats));
  }
}
