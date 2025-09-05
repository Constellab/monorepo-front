import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import {
  HaCoAuthorDialogComponent,
  HaCoAuthorsDialogInput,
} from '../../../ha-core/entity-module/ha-co-author-core/component/ha-co-author-dialog/ha-co-author-dialog.component';
import { HaCommentsSectionComponent } from '../../../ha-core/entity-module/ha-comments-core/component/ha-comments-section/ha-comments-section.component';
import { HaCommentButtonComponent } from '../../../ha-core/entity-module/ha-util-component-core/component/ha-comment-button/ha-comment-button.component';
import { HaLikeButtonComponent } from '../../../ha-core/entity-module/ha-util-component-core/component/ha-like-button/ha-like-button.component';
import { HaCommunityApp } from '../../../ha-core/ha-model/ha-entities/ha-community-app.class';
import { HaEntityType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaAppPicturePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-app-picture/ha-app-picture.pipe';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaCommunityAppService } from '../../../ha-core/ha-service/ha-community-app.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaCommunityAppState } from '../../state/ha-community-app.state';
import { HaCommunityAppTextEditorConfig } from '../../utils/ha-community-app-text-editor.config';
import {
  HaCommunityAppCreateDialogComponent,
  HaCreateCommunityAppInput,
} from '../ha-community-app-create-dialog/ha-community-app-create-dialog.component';

@Component({
  selector: 'ha-community-app-detail',
  imports: [
    FlSectionModule,
    HaCommentsSectionComponent,
    TranslatePipe,
    TeTextEditorModule,
    FormsModule,
    NgOptimizedImage,
    HaAppPicturePipe,
    FlUserModule,
    FlDateModule,
    ReactiveFormsModule,
    MatButton,
    MatIcon,
    CoCommunityLibModule,
    AsyncPipe,
    MatIconButton,
    MatTooltip,
    RouterLink,
    FlTextIconModule,
    HaCommentButtonComponent,
    HaLikeButtonComponent,
    MatTooltip,
    RouterLink,
  ],
  templateUrl: './ha-community-app-detail.component.html',
  styleUrl: './ha-community-app-detail.component.scss',
})
export class HaCommunityAppDetailComponent extends HaCommunityPageDirective implements OnInit {
  private communityAppState: HaCommunityAppState = inject(HaCommunityAppState);
  private authenticatedUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);
  private communityAppService = inject(HaCommunityAppService);
  private dialogService = inject(FlDialogService);

  communityApp = this.communityAppState.app;
  coAuthors = this.communityAppState.getCoAuthors();
  canEdit = this.communityAppState.canEditApp;
  isAuthor: Signal<boolean> = computed(() => {
    const currentUserId = this.communityAppState.getCurrentUser()().id;
    return currentUserId === this.communityApp().createdBy.id;
  });

  currentUser$: Observable<HaUser>;
  commentType: HaEntityType = HaEntityType.APP;
  textEditorConfig: HaCommunityAppTextEditorConfig;
  appDescriptionFormControl = new FormControl<TeRichText>(null);
  entityType = HaEntityType.APP;

  profileRoute = HaRouterService.getProfileRoute();

  ngOnInit(): void {
    this.textEditorConfig = new HaCommunityAppTextEditorConfig(
      this.communityAppService,
      this.communityApp().id
    );
    this.appDescriptionFormControl.patchValue(this.communityApp().description);
    this.appDescriptionFormControl.disable();
    this.currentUser$ = this.authenticatedUserService.getUser();

    const appImage: string = this.communityApp().picture
      ? this.communityAppService.getAppPictureUrl(this.communityApp().picture)
      : null;

    super.setMetaTags(
      { text: 'ha.app_detail.title', translateParam: { param: { title: this.communityApp().title } } },
      { text: 'ha.app_detail.description', translateParam: { param: { title: this.communityApp().title } } },
      appImage,
      HaRouterService.getFullRoute(
        HaRouterService.getCommunityAppRoute(
          this.communityApp().id,
          ClStringHelper.getCleanUrlPath(this.communityApp().title)
        )
      )
    );
  }

  editDescription(): void {
    this.appDescriptionFormControl.enable();
  }

  saveDescription(): void {
    this.communityAppService
      .updateAppDescription(this.communityApp().id, this.appDescriptionFormControl.value)
      .subscribe((app) => {
        this.communityAppState.set(app);
        this.appDescriptionFormControl.disable();
      });
  }

  openCoAuthorsDialog(): void {
    const input: HaCoAuthorsDialogInput = {
      id: this.communityApp().id,
      service: this.communityAppService,
      inviteText: 'invite_community_app_coauthor_information',
      authorId: this.communityApp().createdBy.id,
    };

    this.dialogService
      .openSmallDialog(HaCoAuthorDialogComponent, { data: input })
      .afterClosed()
      .subscribe(() => {
        if (this.communityApp()) {
          this.communityAppState.initCoAuthors(this.communityApp().id);
        }
      });
  }

  openEditAppDialog(): void {
    if (!this.communityApp()) return;

    const input: HaCreateCommunityAppInput = {
      mode: 'update',
      object: {
        id: this.communityApp().id,
        appUrl: this.communityApp().appUrl,
        spaceId: this.communityApp().space?.id,
        title: this.communityApp().title,
        description: this.communityApp().description,
        picture: this.communityApp().picture,
      },
    };

    this.dialogService
      .openMediumDialog(HaCommunityAppCreateDialogComponent, { data: input })
      .afterClosed()
      .subscribe((communityApp: HaCommunityApp) => {
        if (communityApp) {
          this.communityAppState.set(communityApp);
        }
      });
  }
}
