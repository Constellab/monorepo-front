import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
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
import { HaJsonLdState } from '../../../ha-core/ha-state/ha-json-ld.state';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [HaCommunityAppState, HaEntityCommentState],
})
export class HaCommunityAppPageComponent extends HaCommunityPageDirective implements OnInit, OnDestroy {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private authenticatedUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);
  private communityAppState: HaCommunityAppState = inject(HaCommunityAppState);
  private communityAppService: HaCommunityAppService = inject(HaCommunityAppService);
  private entityCommentState: HaEntityCommentState = inject(HaEntityCommentState);
  private jsonLdState: HaJsonLdState = inject(HaJsonLdState);
  private dialogService: FlDialogService = inject(FlDialogService);
  private viewContainerRef = inject(ViewContainerRef);
  private router = inject(Router);

  textEditorConfig: HaCommunityAppTextEditorConfig;
  appDescriptionFormControl = new FormControl<TeRichText | null>(null);
  currentUser: HaUser | null | undefined;
  entityType = HaEntityType.APP;
  tempTitle: string;

  communityApp = computed(() => {
    const app = this.communityAppState.app();

    if (!app) return app;

    const appImage: string | null = app.picture
      ? this.communityAppService.getAppPictureUrl(app.picture)
      : null;
    const pageUrl = HaRouterService.getFullRoute(
      HaRouterService.getCommunityAppRoute(app.id, ClStringHelper.getCleanUrlPath(app.title) ?? '')
    );

    super.setMetaTags(
      { text: 'ha.app.title', translateParam: { param: { title: app.title } } },
      { text: 'ha.app.description', translateParam: { param: { title: app.title } } },
      appImage ?? '',
      pageUrl
    );

    this.jsonLdState.setSoftwareAppJsonLdContent(app.title, pageUrl, appImage ?? undefined);

    this.textEditorConfig = new HaCommunityAppTextEditorConfig(this.communityAppService, app.id);

    this.appDescriptionFormControl.patchValue(app.description);
    this.appDescriptionFormControl.disable();
    return app;
  });

  notFound = this.communityAppState.isErrored;
  isLoading = this.communityAppState.isLoading;
  contributors = computed(() => {
    const app = this.communityAppState.app();
    const coAuthors = this.communityAppState.getCoAuthors()();
    if (!app || !coAuthors) return [];
    return [app.createdBy, ...coAuthors];
  });
  canEdit = this.communityAppState.canEditApp;
  isAuthor = computed(() => {
    const app = this.communityAppState.app();
    if (!this.currentUser || !app) return false;
    return this.currentUser.id === app.createdBy.id;
  });

  onAboutEditionLoading: boolean = false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.communityAppState.init(params.id);
      this.entityCommentState.init(this.entityType, params.id);
      this.tempTitle = ClStringHelper.fromKebabCaseToSentence(params.title) ?? '';
    });

    this.authenticatedUserService.getUser().subscribe((user) => {
      this.currentUser = user;
    });
  }

  editAbout(): void {
    this.appDescriptionFormControl.enable();
  }

  saveAbout(): void {
    const description = this.appDescriptionFormControl.value;
    if (description == null) return;

    this.onAboutEditionLoading = true;
    const app = this.requireApp();
    this.communityAppService.updateAppDescription(app.id, description).subscribe((updatedApp) => {
      this.communityAppState.set(updatedApp);
      this.onAboutEditionLoading = false;
      this.appDescriptionFormControl.disable();
    });
  }

  openEditCommunityAppDialog(): void {
    const app = this.requireApp();
    const data: HaCreateCommunityAppInput = {
      mode: 'update',
      object: {
        id: app.id,
        title: app.title,
        appUrl: app.appUrl,
        contactMail: app.contactMail,
        picture: app.picture,
        spaceId: app.space?.id,
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
    const app = this.requireApp();
    const data: FlConfirmDialogInput = {
      title: 'delete_community_app_confirm_title',
      content: 'delete_community_app_confirm_message',
      successMessage: 'community_app_deleted',
      observable: this.communityAppService.deleteApp(app.id).pipe(
        map((res) => {
          if (res) {
            this.router.navigate([HaRouterService.getCommunityAppListRoute()]);
          }
        })
      ),
    };

    this.dialogService.openConfirmDialog(data);
  }

  private requireApp(): HaCommunityApp {
    const app = this.communityApp();
    if (app == null) {
      throw new Error('HaCommunityAppPageComponent used without a loaded app');
    }
    return app;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.jsonLdState.clearJsonLdContent();
  }
}
