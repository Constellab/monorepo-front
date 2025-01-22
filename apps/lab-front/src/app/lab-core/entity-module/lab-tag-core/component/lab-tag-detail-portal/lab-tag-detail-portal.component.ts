import { Component, inject } from '@angular/core';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib';
import { LabTagDetail } from '../../../../model/entities/lab-tag.entity';
import { Observable } from 'rxjs';
import { LabTagService } from '../../../../entity-service/lab-tag.service';
import { FlPortalModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-portal/fl-portal.module';
import { FlSectionModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { FlKeyValueModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { MatDivider } from '@angular/material/divider';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { LabTagOriginsComponent } from '../lab-tag-origins/lab-tag-origins.component';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';
import { FlTagModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-tag/fl-tag.module';

export interface LabTagDetailPortalInput {
  entityTagId: string;
}

@Component({
  selector: 'lab-tag-detail-portal',
  templateUrl: './lab-tag-detail-portal.component.html',
  styleUrls: ['./lab-tag-detail-portal.component.scss'],
  imports: [
    FlPortalModule,
    FlSectionModule,
    FlKeyValueModule,
    MatDivider,
    FlTextIconModule,
    LabTagOriginsComponent,
    AsyncPipe,
    TranslatePipe,
    FlDateModule,
    FlTagModule,
  ],
})
export class LabTagDetailPortalComponent {
  private tagService = inject(LabTagService);

  tagDetail$: Observable<LabTagDetail>;

  constructor() {
    const input = inject<LabTagDetailPortalInput>(FL_PORTAL_DATA);

    this.tagDetail$ = this.tagService.getEntityTag(input.entityTagId);
  }
}
