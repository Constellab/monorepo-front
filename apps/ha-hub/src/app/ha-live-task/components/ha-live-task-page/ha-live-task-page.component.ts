import {Component, OnInit} from '@angular/core';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HaLiveTask} from '../../../ha-core/ha-model/ha-entities/ha-live-task.class';
import {FlDialogService} from '@monorepo/front-core-lib';
import {HaUser} from '../../../ha-core/ha-model/ha-entities/ha-user';
import {HaAuthenticatedUserService} from '../../../ha-core/ha-service/ha-authenticated-user.service';
import {
  HaCoAuthorDialogComponent,
  HaCoAuthorsDialogInput
} from '../../../ha-core/entity-module/ha-co-author-core/component/ha-co-author-dialog/ha-co-author-dialog.component';
import {HaRouterService} from '../../../ha-core/ha-service/ha-router.service';


@Component({
  selector: 'ha-live-task-page',
  templateUrl: './ha-live-task-page.component.html',
  styleUrls: ['./ha-live-task-page.component.scss']
})
export class HaLiveTaskPageComponent implements OnInit {

  liveTask: HaLiveTask;
  isLoading = true;
  currentUser: HaUser;
  canEditLt = false;
  ltCoAuthors: HaUser[];
  liveTaskListRoute= HaRouterService.getLiveTaskListRoute();

  constructor(
    private liveTaskService: HaLiveTaskService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private authenticatedUserService: HaAuthenticatedUserService,
    private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    this.authenticatedUserService.getUser().subscribe(user => {
      this.currentUser = user;
    });

    this.liveTaskService.getLiveTaskById(this.activeRoute.snapshot.params.id).subscribe(liveTask => {
      if (liveTask == null) {
        this.router.navigate(['../../'], {relativeTo: this.activeRoute});
      } else {
        this.liveTask = liveTask;
        if (this.currentUser != null) {
          this.canEditLt = this.currentUser.id === this.liveTask.createdBy.id;
          if (!this.canEditLt) {
            this.liveTaskService.getCoAuthors(this.liveTask.id).subscribe((coAuthors) => {
              this.ltCoAuthors = coAuthors;
              this.canEditLt = coAuthors.some(coAuthor => coAuthor.id === this.currentUser.id);
              this.isLoading = false;
            });
          } else {
            this.isLoading = false;
          }
        } else {
          this.isLoading = false;
        }
      }
    });
  }

  openLtCoAuthorsDialog(): void {
    const input: HaCoAuthorsDialogInput = {
      id: this.liveTask.id,
      service: this.liveTaskService,
      inviteText: 'invite_live_task_coauthor_information'
    }

    this.dialogService.openSmallDialog(HaCoAuthorDialogComponent, {data: input}).afterClosed().subscribe(() => {
      this.liveTaskService.getCoAuthors(this.liveTask.id).subscribe((coAuthors) => {
        this.ltCoAuthors = coAuthors;
        this.canEditLt = coAuthors.some(coAuthor => coAuthor.id === this.currentUser.id);
      });
    });
  }
}
