import {Component, OnInit} from '@angular/core';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HaLiveTask} from '../../../ha-core/ha-model/ha-entities/ha-live-task.class';
import {HaBrickVersion} from '../../../ha-core/ha-model/ha-entities/ha-brick-version.class';


@Component({
  selector: 'ha-live-task-page',
  templateUrl: './ha-live-task-page.component.html',
  styleUrls: ['./ha-live-task-page.component.scss']
})
export class HaLiveTaskPageComponent implements OnInit {

  liveTask: HaLiveTask;
  brickDependencies: HaBrickVersion[];
  currentTab: string;

  constructor(
    private liveTaskService: HaLiveTaskService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.liveTaskService.getLiveTaskById(this.activeRoute.snapshot.params.id).subscribe(liveTask => {
      if (liveTask == null) {
        this.router.navigate(['../'], {relativeTo: this.activeRoute});
      }
      this.liveTask = liveTask;
      this.liveTaskService.getLatestLiveTaskVersionByLiveTaskId(this.liveTask.id).subscribe(liveTaskVersion => {
        this.liveTaskService.getLiveTaskVersionBrickDependencies(liveTaskVersion.id).subscribe(brickDependencies => {
          this.brickDependencies = brickDependencies;
        });
      })
    });

    this.currentTab = this.activeRoute.snapshot.firstChild.url[0]?.path;
  }

}
