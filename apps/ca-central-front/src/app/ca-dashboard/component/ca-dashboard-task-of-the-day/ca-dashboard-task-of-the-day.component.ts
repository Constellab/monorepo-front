import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CoCommunityHelperService } from '@monorepo/community-lib';

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
  styleUrls: ['./ca-dashboard-task-of-the-day.component.scss']
})
export class CaDashboardTaskOfTheDayComponent implements OnInit {

  task: CaTask;
  taskHubUrl: string;

  constructor(private http: HttpClient,
              private communityHelper: CoCommunityHelperService) {
  }

  ngOnInit(): void {
    this.http.get(this.communityHelper.getTaskOfTheDayApiUrl()).subscribe((res: CaTask) => {
      this.task = res;
      this.taskHubUrl = this.communityHelper.getTaskUrl(this.task.brickName, this.task.uniqueName);
    });
  }

}
