import {Component, OnInit} from '@angular/core';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HaLiveTask} from '../../../ha-core/ha-model/ha-entities/ha-live-task.class';
import {HaBrickVersion} from '../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import {Observable} from 'rxjs';


@Component({
  selector: 'ha-live-task-page',
  templateUrl: './ha-live-task-page.component.html',
  styleUrls: ['./ha-live-task-page.component.scss']
})
export class HaLiveTaskPageComponent implements OnInit {

  liveTask: HaLiveTask;
  brickDependencies$: Observable<HaBrickVersion[]>;
  currentTab: string;
  isLoading = true;

  constructor(
    private liveTaskService: HaLiveTaskService,
    private activeRoute: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.liveTaskService.getLiveTaskById(this.activeRoute.snapshot.params.id).subscribe(liveTask => {
      if (liveTask == null) {
        this.router.navigate(['../'], {relativeTo: this.activeRoute});
      } else {
        this.liveTask = liveTask;
        this.brickDependencies$ = this.liveTaskService.getLiveTaskBrickDependencies(this.liveTask.id);
        this.isLoading = false;
      }
    });

    this.currentTab = this.activeRoute.snapshot.firstChild.url[0]?.path;
  }

}
