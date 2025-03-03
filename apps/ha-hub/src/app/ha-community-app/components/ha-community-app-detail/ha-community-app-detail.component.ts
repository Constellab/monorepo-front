import { Component, inject, OnInit } from '@angular/core';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { HaCommentsSectionComponent } from '../../../ha-core/entity-module/ha-comments-core/component/ha-comments-section/ha-comments-section.component';
import { HaCommunityAppState } from '../../state/ha-community-app.state';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaCommentType } from '../../../ha-core/entity-module/ha-comments-core/model/ha-abstract-comment.class';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ha-community-app-detail',
  imports: [FlSectionModule, HaCommentsSectionComponent, TranslatePipe],
  templateUrl: './ha-community-app-detail.component.html',
  styleUrl: './ha-community-app-detail.component.scss',
})
export class HaCommunityAppDetailComponent implements OnInit {
  private communityAppState: HaCommunityAppState = inject(HaCommunityAppState);
  private authenticatedUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);

  communityApp = this.communityAppState.app();

  currentUser: HaUser;
  commentType: HaCommentType = HaCommentType.APP_COMMENT;

  ngOnInit(): void {
    this.authenticatedUserService.getUser().subscribe((user: HaUser) => {
      this.currentUser = user;
    });
  }
}
