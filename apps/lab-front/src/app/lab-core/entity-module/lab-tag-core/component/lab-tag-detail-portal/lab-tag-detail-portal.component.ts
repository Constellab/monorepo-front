import { Component, inject } from '@angular/core';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib/fl-portal';
import { LabTagDetail } from '../../../../model/entities/lab-tag.entity';
import { Observable } from 'rxjs';
import { LabTagService } from '../../../../entity-service/lab-tag.service';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { MatDivider } from '@angular/material/divider';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LabTagOriginsComponent } from '../lab-tag-origins/lab-tag-origins.component';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';

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
