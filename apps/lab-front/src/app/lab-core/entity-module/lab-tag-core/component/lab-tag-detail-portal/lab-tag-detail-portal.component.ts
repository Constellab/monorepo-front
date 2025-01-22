import { Component, inject } from '@angular/core';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib';
import { LabTagDetail } from '../../../../model/entities/lab-tag.entity';
import { Observable } from 'rxjs';
import { LabTagService } from '../../../../entity-service/lab-tag.service';

export interface LabTagDetailPortalInput {
  entityTagId: string;
}

@Component({
  selector: 'lab-tag-detail-portal',
  templateUrl: './lab-tag-detail-portal.component.html',
  styleUrls: ['./lab-tag-detail-portal.component.scss'],
  standalone: false,
})
export class LabTagDetailPortalComponent {
  private tagService = inject(LabTagService);

  tagDetail$: Observable<LabTagDetail>;

  constructor() {
    const input = inject<LabTagDetailPortalInput>(FL_PORTAL_DATA);

    this.tagDetail$ = this.tagService.getEntityTag(input.entityTagId);
  }
}
