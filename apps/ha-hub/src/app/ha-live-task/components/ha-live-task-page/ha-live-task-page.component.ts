import {Component, OnInit, Signal} from '@angular/core';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HaLiveTask} from '../../../ha-core/ha-model/ha-entities/ha-live-task.class';
import {FlDialogService} from '@monorepo/front-core-lib';
import {HaUser} from '../../../ha-core/ha-model/ha-entities/ha-user';
import {
  HaCoAuthorDialogComponent,
  HaCoAuthorsDialogInput
} from '../../../ha-core/entity-module/ha-co-author-core/component/ha-co-author-dialog/ha-co-author-dialog.component';
import {HaRouterService} from '../../../ha-core/ha-service/ha-router.service';
import {first} from 'rxjs';
import {HaLiveTaskPageState} from '../../state/ha-live-task-page.state';


@Component({
  selector: 'ha-live-task-page',
  templateUrl: './ha-live-task-page.component.html',
  styleUrls: ['./ha-live-task-page.component.scss'],
  providers: [HaLiveTaskPageState]
})
export class HaLiveTaskPageComponent implements OnInit {

  profileRoute = HaRouterService.getProfileRoute();
  liveTaskListRoute= HaRouterService.getLiveTaskListRoute();

  liveTask: Signal<HaLiveTask> = this.liveTaskPageState.getLiveTask();
  notFound: Signal<boolean> = this.liveTaskPageState.isLiveTaskError;
  isLoading: Signal<boolean> = this.liveTaskPageState.getIsLoading();
  isAuthor: Signal<boolean> = this.liveTaskPageState.isAuthor;
  ltCoAuthors: Signal<HaUser[]> = this.liveTaskPageState.getLiveTaskCoAuthors();

  constructor(
    private liveTaskService: HaLiveTaskService,
    private activeRoute: ActivatedRoute,
    private dialogService: FlDialogService,
    private liveTaskPageState: HaLiveTaskPageState,
    private router: Router) {
  }

  ngOnInit(): void {

    this.activeRoute.params.pipe(first()).subscribe((params) => {
      if (!params.id) {
        return;
      }
      this.liveTaskPageState.init(params.id, params.title);
    });
  }


  openLtCoAuthorsDialog(): void {
    const input: HaCoAuthorsDialogInput = {
      id: this.liveTask().id,
      service: this.liveTaskService,
      inviteText: 'invite_live_task_coauthor_information'
    }

    this.dialogService.openSmallDialog(HaCoAuthorDialogComponent, {data: input}).afterClosed().subscribe(() => {
      if(this.liveTask()){
        this.liveTaskPageState.initCoAuthors();
      }
    });
  }
}
