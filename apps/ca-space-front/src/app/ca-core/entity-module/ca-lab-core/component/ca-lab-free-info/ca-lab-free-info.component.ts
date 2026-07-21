import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { CaLabFreeGetDto } from '../../../../model/entities/lab/ca-lab-free.class';
import { CaDetailRoutePipe } from '../../../../module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';

@Component({
  selector: 'ca-lab-free-info',
  templateUrl: './ca-lab-free-info.component.html',
  styleUrls: ['./ca-lab-free-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlTextIconModule,
    MatIcon,
    FlKeyValueModule,
    FlUserModule,
    MatAnchor,
    FlCoreDirectiveModule,
    RouterLink,
    CaDetailRoutePipe,
    TranslatePipe,
    FlDateModule,
  ],
})
export class CaLabFreeInfoComponent {
  @Input() freeLab: CaLabFreeGetDto;

  @Input() showCreateButton: boolean = true;
}
