import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FL_PORTAL_DATA, FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiTagDetail, LiTagService } from '@monorepo/lab-lib/li-core';
import { LiTagOriginsComponent } from '../li-tag-origins/li-tag-origins.component';
import { MatDivider } from '@angular/material/divider';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

export interface LiTagDetailPortalInput {
  entityTagId: string;
}

@Component({
  selector: 'li-tag-detail-portal',
  templateUrl: './li-tag-detail-portal.component.html',
  styleUrls: ['./li-tag-detail-portal.component.scss'],
  imports: [
    FlPortalModule,
    FlSectionModule,
    FlKeyValueModule,
    MatDivider,
    FlTextIconModule,
    LiTagOriginsComponent,
    AsyncPipe,
    TranslatePipe,
    FlDateModule,
    FlTagModule,
  ],
})
export class LiTagDetailPortalComponent {
  private tagService = inject(LiTagService);

  tagDetail$: Observable<LiTagDetail>;

  constructor() {
    const input = inject<LiTagDetailPortalInput>(FL_PORTAL_DATA);

    this.tagDetail$ = this.tagService.getEntityTag(input.entityTagId);
  }
}
