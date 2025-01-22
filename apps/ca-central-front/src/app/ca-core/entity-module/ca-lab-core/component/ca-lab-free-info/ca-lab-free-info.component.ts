import { Component, Input } from '@angular/core';
import { CaLabFreeGetDto } from '../../../../model/entities/lab/ca-lab-free.class';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlKeyValueModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { MatAnchor } from '@angular/material/button';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { FlCoreDirectiveModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { CaDetailRoutePipe } from '../../../../module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';

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
