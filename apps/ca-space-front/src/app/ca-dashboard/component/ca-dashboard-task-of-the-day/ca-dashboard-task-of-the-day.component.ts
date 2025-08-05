import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { TranslatePipe } from '@ngx-translate/core';

export interface CaTask {
  id: string;
  brickName: string;
  brickMajor: number;
  humanName: string;
  uniqueName: string;
  shortDescription: string;
}

@Component({
  selector: 'ca-dashboard-task-of-the-day',
  templateUrl: './ca-dashboard-task-of-the-day.component.html',
  styleUrls: ['./ca-dashboard-task-of-the-day.component.scss'],
  imports: [FlCardModule, MatAnchor, MatIcon, TranslatePipe],
})
export class CaDashboardTaskOfTheDayComponent implements OnInit {
  private http = inject(HttpClient);
  private communityHelper = inject(CoCommunityHelperService);

  task: CaTask;
  taskHubUrl: string;

  ngOnInit(): void {
    this.http.get(this.communityHelper.getTaskOfTheDayApiUrl()).subscribe((res: CaTask) => {
      this.task = res;
      this.taskHubUrl = this.communityHelper.getTaskUrl(this.task.brickName, this.task.uniqueName);
    });
  }
}
