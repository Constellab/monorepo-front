import { Component, computed, inject, OnInit, ViewContainerRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlConfirmDialogInput, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

import { HaCommentsSectionComponent } from '../../../ha-core/entity-module/ha-comments-core/component/ha-comments-section/ha-comments-section.component';
import { HaEntityPageInfoComponent } from '../../../ha-core/ha-component/ha-entity-page-infos/ha-entity-page-info.component';
import { HaPageComponent } from '../../../ha-core/ha-component/ha-page/ha-page.component';
import { HaCommunityApp } from '../../../ha-core/ha-model/ha-entities/ha-community-app.class';
import { HaEntityType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaAppPicturePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-app-picture/ha-app-picture.pipe';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaCommunityAppService } from '../../../ha-core/ha-service/ha-community-app.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaEntityCommentState } from '../../../ha-core/ha-state/ha-entity-comment.state';
import { HaCommunityAppState } from '../../state/ha-community-app.state';
import { HaCommunityAppTextEditorConfig } from '../../utils/ha-community-app-text-editor.config';
import { HaCommunityAppCarouselComponent } from '../ha-community-app-carousel/ha-community-app-carousel.component';
import {
  HaCommunityAppCreateDialogComponent,
  HaCreateCommunityAppInput,
} from '../ha-community-app-create-dialog/ha-community-app-create-dialog.component';
import { HaCommunityAppMediaEditDialogComponent } from '../ha-community-app-media-edit-dialog/ha-community-app-media-edit-dialog.component';

@Component({
  selector: 'ha-community-app-page',
  imports: [
    FlUserModule,
    FlTextIconModule,
    FlLoaderModule,
    HaCommentsSectionComponent,
    HaEntityPageInfoComponent,
    HaPageComponent,
    TranslatePipe,
    TeTextEditorModule,
    ReactiveFormsModule,
    MatButton,
    MatIconModule,
    HaCommunityAppCarouselComponent,
    MatIconButton,
    MatTooltip,
    HaAppPicturePipe,
  ],
  templateUrl: './ha-community-app-page.component.html',
  styleUrl: './ha-community-app-page.component.scss',
  providers: [HaCommunityAppState, HaEntityCommentState],
})
export class HaCommunityAppPageComponent extends HaCommunityPageDirective implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private authenticatedUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);
  private communityAppState: HaCommunityAppState = inject(HaCommunityAppState);
  private communityAppService: HaCommunityAppService = inject(HaCommunityAppService);
  private entityCommentState: HaEntityCommentState = inject(HaEntityCommentState);
  private dialogService: FlDialogService = inject(FlDialogService);
  private viewContainerRef = inject(ViewContainerRef);
  private router = inject(Router);

  textEditorConfig: HaCommunityAppTextEditorConfig;
  appDescriptionFormControl = new FormControl<TeRichText>(null);
  currentUser: HaUser;
  entityType = HaEntityType.APP;
  tempTitle: string;

  communityApp = computed(() => {
    const app = this.communityAppState.app();

    if (!app) return app;

    const appImage: string = app.picture ? this.communityAppService.getAppPictureUrl(app.picture) : null;

    super.setMetaTags(
      { text: 'ha.app.title', translateParam: { param: { title: app.title } } },
      { text: 'ha.app.description', translateParam: { param: { title: app.title } } },
      appImage,
      HaRouterService.getFullRoute(
        HaRouterService.getCommunityAppRoute(app.id, ClStringHelper.getCleanUrlPath(app.title))
      )
    );

    this.textEditorConfig = new HaCommunityAppTextEditorConfig(this.communityAppService, app.id);

    this.appDescriptionFormControl.patchValue(app.description);
    this.appDescriptionFormControl.disable();
    return app;
  });

  notFound = this.communityAppState.isErrored;
  isLoading = this.communityAppState.isLoading;
  contributors = computed(() => {
    const coAuthors = this.communityAppState.getCoAuthors()();
    if (!this.communityAppState.app() || !coAuthors) return [];
    return [this.communityAppState.app().createdBy, ...coAuthors];
  });
  canEdit = this.communityAppState.canEditApp;
  isAuthor = computed(() => {
    if (!this.currentUser || !this.communityAppState.app()) return false;
    return this.currentUser.id === this.communityAppState.app().createdBy.id;
  });

  onAboutEditionLoading: boolean = false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.communityAppState.init(params.id);
      this.entityCommentState.init(this.entityType, params.id);
      this.tempTitle = ClStringHelper.fromKebabCaseToSentence(params.title);
    });

    this.authenticatedUserService.getUser().subscribe((user: HaUser) => {
      this.currentUser = user;
    });
  }

  editAbout(): void {
    this.appDescriptionFormControl.enable();
  }

  saveAbout(): void {
    this.onAboutEditionLoading = true;
    this.communityAppService
      .updateAppDescription(this.communityApp().id, this.appDescriptionFormControl.value)
      .subscribe((updatedApp) => {
        this.communityAppState.set(updatedApp);
        this.onAboutEditionLoading = false;
        this.appDescriptionFormControl.disable();
      });
  }

  openEditCommunityAppDialog(): void {
    const data: HaCreateCommunityAppInput = {
      mode: 'update',
      object: {
        id: this.communityApp().id,
        title: this.communityApp().title,
        appUrl: this.communityApp().appUrl,
        contactMail: this.communityApp().contactMail,
        picture: this.communityApp().picture,
        spaceId: this.communityApp().space?.id,
      },
    };
    this.dialogService
      .openMediumDialog(HaCommunityAppCreateDialogComponent, { data: data })
      .afterClosed()
      .subscribe((communityApp: HaCommunityApp) => {
        if (communityApp) {
          this.communityAppState.set(communityApp);
        }
      });
  }

  openEditAppCarouselDialog(): void {
    this.dialogService.openMediumDialog(HaCommunityAppMediaEditDialogComponent, {
      viewContainerRef: this.viewContainerRef,
    });
  }

  deleteCommunityApp(): void {
    const data: FlConfirmDialogInput = {
      title: 'delete_community_app_confirm_title',
      content: 'delete_community_app_confirm_message',
      successMessage: 'community_app_deleted',
      observable: this.communityAppService.deleteApp(this.communityApp().id).pipe(
        map((res) => {
          if (res) {
            this.router.navigate([HaRouterService.getCommunityAppListRoute()]);
          }
        })
      ),
    };

    this.dialogService.openConfirmDialog(data);
  }
}
