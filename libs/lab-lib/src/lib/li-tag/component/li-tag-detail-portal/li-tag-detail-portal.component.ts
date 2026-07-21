import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { CoTagCommunityIconComponent } from '@monorepo/community-lib';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FL_PORTAL_DATA, FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiEntityTag, LiTagKeyModel, LiTagService, LiTagValueModel } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiTagOriginsComponent } from '../li-tag-origins/li-tag-origins.component';

export interface LiTagDetailPortalInput {
  tagKey: string;
  tagValue: string;
  tagEntityId: string;
}

@Component({
  selector: 'li-tag-detail-portal',
  templateUrl: './li-tag-detail-portal.component.html',
  styleUrls: ['./li-tag-detail-portal.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
    CoTagCommunityIconComponent,
    FlCorePipeModule,
  ],
})
export class LiTagDetailPortalComponent implements OnInit {
  private input = inject<LiTagDetailPortalInput>(FL_PORTAL_DATA);
  private tagService = inject(LiTagService);

  tagKeyModel: LiTagKeyModel;

  tagValueModel: LiTagValueModel;

  entityTag: LiEntityTag;

  tagEntityId: string;

  ngOnInit(): void {
    this.tagEntityId = this.input.tagEntityId;
    this.tagService
      .getTagKeyByKey(this.input.tagKey)
      .subscribe((tagKeyModel) => (this.tagKeyModel = tagKeyModel));
    this.tagService
      .getTagValueByKeyAndValue(this.input.tagKey, this.input.tagValue)
      .subscribe((tagValueModel) => (this.tagValueModel = tagValueModel));
    this.tagService.getEntityTag(this.tagEntityId).subscribe((tag: LiEntityTag) => {
      this.entityTag = tag;
    });
  }

  getAdditionalInfoString(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return value.toString();
  }
}
