import { ChangeDetectionStrategy,Component, computed, inject, input } from '@angular/core';

import { LmlBrickService } from '../../lml-brick.service';
import { LmlBrickVersion } from '../../model/lml-brick.class';

/**
 * Simple component to show brick version detail
 */
@Component({
  selector: 'lml-brick-version-detail',
  templateUrl: './lml-brick-version-detail.component.html',
  styleUrls: ['./lml-brick-version-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LmlBrickVersionDetailComponent {
  brickName = input.required<string>();
  brickVersion = input.required<LmlBrickVersion>();

  private brickService = inject(LmlBrickService);
  communityLink = computed(() =>
    this.brickService.getBrickUrl(this.brickName(), this.brickVersion().brickVersion)
  );
}
