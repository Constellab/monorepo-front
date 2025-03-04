import { Component, inject, OnInit } from '@angular/core';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { HaCommentsSectionComponent } from '../../../ha-core/entity-module/ha-comments-core/component/ha-comments-section/ha-comments-section.component';
import { HaCommunityAppState } from '../../state/ha-community-app.state';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaCommentType } from '../../../ha-core/entity-module/ha-comments-core/model/ha-abstract-comment.class';
import { TranslatePipe } from '@ngx-translate/core';
import { TeCompleteConfig, TeTextEditorModule } from '@monorepo/text-editor';
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { HaAppPicturePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-app-picture/ha-app-picture.pipe';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';

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
  ],
  templateUrl: './ha-community-app-detail.component.html',
  styleUrl: './ha-community-app-detail.component.scss',
})
export class HaCommunityAppDetailComponent implements OnInit {
  private communityAppState: HaCommunityAppState = inject(HaCommunityAppState);
  private authenticatedUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);

  communityApp = this.communityAppState.app();

  currentUser: HaUser;
  commentType: HaCommentType = HaCommentType.APP_COMMENT;
  textEditorConfig = new TeCompleteConfig();

  ngOnInit(): void {
    this.authenticatedUserService.getUser().subscribe((user: HaUser) => {
      this.currentUser = user;
    });
  }
}
