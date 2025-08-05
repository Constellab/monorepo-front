import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiRouterService, LiTypeEntity, LiTypeService } from '@monorepo/lab-lib/li-core';
import { TdTechnicalDocModule, TdTypingName } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, share } from 'rxjs';
import { map } from 'rxjs/operators';

import { LiTypeDetailComponent } from '../li-type-detail/li-type-detail.component';

export interface LiTypeDialogInput {
  typingName: string;
}

@Component({
  selector: 'li-type-dialog',
  templateUrl: './li-type-dialog.component.html',
  styleUrls: ['./li-type-dialog.component.scss'],
  imports: [
    FlSectionModule,
    FlDialogModule,
    TdTechnicalDocModule,
    CdkScrollable,
    MatDialogContent,
    MatAnchor,
    RouterLink,
    MatIcon,
    LiTypeDetailComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class LiTypeDialogComponent {
  private input = inject<LiTypeDialogInput>(MAT_DIALOG_DATA);
  private typeService = inject(LiTypeService);
  private communityHelper = inject(CoCommunityHelperService);

  type$: Observable<LiTypeEntity> = this.typeService.getTyping(this.input.typingName).pipe(share());
  technicalDocUrl$: Observable<string> = this.type$.pipe(map((type) => this.getCommunityUrl(type)));

  detailRoute: string;

  constructor() {
    const input = this.input;

    this.detailRoute = LiRouterService.getTechnicalDocRoute(input.typingName);
  }

  getCommunityUrl(type: LiTypeEntity): string {
    const typingName = new TdTypingName(type.typingName);
    return this.communityHelper.getTechnicalDocUrl(typingName, type.brickVersion);
  }
}
