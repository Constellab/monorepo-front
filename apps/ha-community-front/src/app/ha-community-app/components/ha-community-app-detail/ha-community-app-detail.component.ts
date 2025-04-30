import { Component, inject, OnInit } from '@angular/core';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { HaCommentsSectionComponent } from '../../../ha-core/entity-module/ha-comments-core/component/ha-comments-section/ha-comments-section.component';
import { HaCommunityAppState } from '../../state/ha-community-app.state';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { TranslatePipe } from '@ngx-translate/core';
import { TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { HaAppPicturePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-app-picture/ha-app-picture.pipe';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { HaCommunityAppTextEditorConfig } from '../../utils/ha-community-app-text-editor.config';
import { HaCommunityAppService } from '../../../ha-core/ha-service/ha-community-app.service';
import { MatButton } from '@angular/material/button';
import {
  HaCommunityAppCreateDialogComponent,
  HaCreateCommunityAppInput,
} from '../ha-community-app-create-dialog/ha-community-app-create-dialog.component';
import { HaCommunityApp } from '../../../ha-core/ha-model/ha-entities/ha-community-app.class';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { MatIcon } from '@angular/material/icon';
import { HaEntityType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { ClStringHelper } from '@monorepo/core-lib';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { Observable } from 'rxjs';

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

  currentUser$: Observable<HaUser>;
  commentType: HaEntityType = HaEntityType.APP;
  textEditorConfig: HaCommunityAppTextEditorConfig;
  appDescriptionFormControl = new FormControl<TeRichText>(null);

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
