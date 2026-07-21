import { ChangeDetectionStrategy,Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';

import { CaLab, CaLabMinimumDTO } from '../../../../model/entities/lab/ca-lab.class';
import { CaDetailRoutePipe } from '../../../../module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';

@Component({
  selector: 'ca-lab-inline',
  templateUrl: './ca-lab-inline.component.html',
  styleUrls: ['./ca-lab-inline.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlTextIconModule, MatIcon, MatTooltip, TranslatePipe, RouterLink, CaDetailRoutePipe],
})
export class CaLabInlineComponent {
  lab = input.required<CaLab | CaLabMinimumDTO>();

  useLink = input<boolean>(false);
}
