import { ChangeDetectionStrategy,Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiDetailRoutePipe, LiTagOrigin, LiTagService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

/**
 * Component to show the list of tag origins
 */
@Component({
  selector: 'li-tag-origins',
  templateUrl: './li-tag-origins.component.html',
  styleUrl: './li-tag-origins.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlSectionModule, FlKeyValueModule, FlUserModule, RouterLink, TranslatePipe, LiDetailRoutePipe],
})
export class LiTagOriginsComponent implements OnInit {
  private tagService = inject(LiTagService);

  @Input({ required: true }) tagEntityId: string;

  origins$: Observable<LiTagOrigin[]>;

  ngOnInit(): void {
    this.origins$ = this.tagService.getEntityTagOrigins(this.tagEntityId);
  }
}
