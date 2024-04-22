import {Component, OnInit} from '@angular/core';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {ActivatedRoute} from '@angular/router';
import {HaLiveTask} from '../../../ha-core/ha-model/ha-entities/ha-live-task.class';
import {FlDialogService} from '@monorepo/front-core-lib';
import {HaUser} from '../../../ha-core/ha-model/ha-entities/ha-user';
import {HaAuthenticatedUserService} from '../../../ha-core/ha-service/ha-authenticated-user.service';
import {
  HaCoAuthorDialogComponent,
  HaCoAuthorsDialogInput
} from '../../../ha-core/entity-module/ha-co-author-core/component/ha-co-author-dialog/ha-co-author-dialog.component';
import {HaRouterService} from '../../../ha-core/ha-service/ha-router.service';
import {first} from 'rxjs';
import {ClStringHelper} from '@monorepo/core-lib';
import {HaHttpRedirectionService} from '../../../ha-core/ha-service/ha-http-redirection.service';


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
  notFound: boolean = false;
  paramTitle: string;

  constructor(
    private liveTaskService: HaLiveTaskService,
    private activeRoute: ActivatedRoute,
    private httpRedirectionService: HaHttpRedirectionService,
    private authenticatedUserService: HaAuthenticatedUserService,
    private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    this.authenticatedUserService.getUser().subscribe(user => {
      this.currentUser = user;
    });

    this.activeRoute.params.pipe(first()).subscribe((params) => {
      this.paramTitle = params.title;
      this.liveTaskService.getLiveTaskById(params.id).subscribe({
        next: (liveTask) => {
          if (liveTask) {
            this.liveTask = liveTask;

            if (this.paramTitle !== ClStringHelper.getCleanUrlPath(this.liveTask.title)) {
              this.httpRedirectionService.redirectTo(
                HaRouterService.getLiveTaskRoute(this.liveTask.id, ClStringHelper.getCleanUrlPath(this.liveTask.title)));
            }

            if (this.currentUser != null) {
              this.canEditLt = this.currentUser.id === this.liveTask.createdBy.id;
              if (!this.canEditLt) {
                this.setCoAuthors();
              } else {
                this.isLoading = false;
              }
            } else {
              this.isLoading = false;
            }
          } else {
            this.notFound = true;
            this.isLoading = false;
          }
        },
        error: () => {
          this.notFound = true;
          this.isLoading = false;
        }
      });
    });
  }

  private setCoAuthors(): void {
    this.liveTaskService.getCoAuthors(this.liveTask.id).subscribe((coAuthors) => {
      this.ltCoAuthors = coAuthors;
      this.canEditLt = coAuthors.some(coAuthor => coAuthor.id === this.currentUser.id);
      this.isLoading = false;
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
