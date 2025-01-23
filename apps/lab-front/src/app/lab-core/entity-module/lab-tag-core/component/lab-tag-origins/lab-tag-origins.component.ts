import { Component, Input, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LabTagOrigin } from '../../../../model/entities/lab-tag.entity';
import { LabTagService } from '../../../../entity-service/lab-tag.service';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LabDetailRoutePipe } from '../../../../lab-core-pipe/lab-detail-route/lab-detail-route.pipe';

/**
 * Component to show the list of tag origins
 */
@Component({
  selector: 'lab-tag-origins',
  templateUrl: './lab-tag-origins.component.html',
  styleUrl: './lab-tag-origins.component.scss',
  imports: [FlSectionModule, FlKeyValueModule, FlUserModule, RouterLink, TranslatePipe, LabDetailRoutePipe],
})
export class LabTagOriginsComponent implements OnInit {
  private tagService = inject(LabTagService);

  @Input({ required: true }) tagEntityId: string;

  origins$: Observable<LabTagOrigin[]>;

  ngOnInit(): void {
    this.origins$ = this.tagService.getEntityTagOrigins(this.tagEntityId);
  }
}
