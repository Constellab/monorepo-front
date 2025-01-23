import { Component, Input } from '@angular/core';
import { CaLabFreeGetDto } from '../../../../model/entities/lab/ca-lab-free.class';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { MatAnchor } from '@angular/material/button';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { CaDetailRoutePipe } from '../../../../module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';

@Component({
  selector: 'ca-lab-free-info',
  templateUrl: './ca-lab-free-info.component.html',
  styleUrls: ['./ca-lab-free-info.component.scss'],
  imports: [
    FlTextIconModule,
    MatIcon,
    FlKeyValueModule,
    FlUserModule,
    MatAnchor,
    RouterLinkActive,
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
