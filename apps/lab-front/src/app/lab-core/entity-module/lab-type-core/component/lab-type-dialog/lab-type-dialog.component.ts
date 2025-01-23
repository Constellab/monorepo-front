import { Component, inject } from '@angular/core';
import { LabTypeEntity } from '../../../../model/entities/lab-type/lab-type.entity';
import { LabRouterService } from '../../../../service/lab-router.service';
import { LabTypeService } from '../../../../entity-service/lab-type.service';
import { Observable, share } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { TdTypingName } from '@monorepo/technical-doc';
import { map } from 'rxjs/operators';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { TdTechnicalDocModule } from '../../../../../../../../../libs/technical-doc/src/lib/td-technical-doc.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { LabTypeDetailComponent } from '../lab-type-detail/lab-type-detail.component';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

export interface LabTypeDialogInput {
  typingName: string;
}

@Component({
  selector: 'lab-type-dialog',
  templateUrl: './lab-type-dialog.component.html',
  styleUrls: ['./lab-type-dialog.component.scss'],
  imports: [
    FlSectionModule,
    FlDialogModule,
    TdTechnicalDocModule,
    CdkScrollable,
    MatDialogContent,
    MatAnchor,
    RouterLink,
    MatIcon,
    LabTypeDetailComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class LabTypeDialogComponent {
  private input = inject<LabTypeDialogInput>(MAT_DIALOG_DATA);
  private typeService = inject(LabTypeService);
  private communityHelper = inject(CoCommunityHelperService);

  type$: Observable<LabTypeEntity> = this.typeService.getTyping(this.input.typingName).pipe(share());
  technicalDocUrl$: Observable<string> = this.type$.pipe(map((type) => this.getCommunityUrl(type)));

  detailRoute: string;

  constructor() {
    const input = this.input;

    this.detailRoute = LabRouterService.getTechnicalDocRoute(input.typingName);
  }

  getCommunityUrl(type: LabTypeEntity): string {
    const typingName = new TdTypingName(type.typingName);
    return this.communityHelper.getTechnicalDocUrl(typingName, type.brickVersion);
  }
}
