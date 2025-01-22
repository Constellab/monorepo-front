import { Component, OnInit, inject } from '@angular/core';
import { CaStatsService } from '../../../ca-core/service-api/ca-stats.service';
import { CaStats } from '../../../ca-core/model/entities/ca-stats.class';
import { FlCardModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlTextIconModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { CaDashboardActivityCardComponent } from '../ca-dashboard-activity-card/ca-dashboard-activity-card.component';
import { TranslatePipe } from '@ngx-translate/core';

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
