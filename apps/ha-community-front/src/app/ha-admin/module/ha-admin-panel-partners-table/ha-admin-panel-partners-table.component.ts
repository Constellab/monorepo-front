import { ChangeDetectionStrategy,Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSortHeader } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { FlDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { HaPartner } from '../../../ha-core/ha-model/ha-entities/ha-partner';
import { HaDetailRoutePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-detail-route/ha-detail-route.pipe';
import { HaAdminPanelTableAction } from '../../model/ha-admin-panel-table-action.class';

export interface HaAdminPanelPartnersTableActionEvent {
  type: string;
  partner: HaPartner;
}

@Component({
  selector: 'ha-admin-panel-partners-table',
  imports: [
    MatTable,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCell,
    MatSortHeader,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    TranslatePipe,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatIconButton,
    MatTooltip,
    MatIcon,
    FlUserModule,
    CoCommunityLibModule,
    RouterLink,
    HaDetailRoutePipe,
  ],
  templateUrl: './ha-admin-panel-partners-table.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ha-admin-panel-partners-table.component.scss',
})
export class HaAdminPanelPartnersTableComponent {
  datasource = input.required<FlDatasource<HaPartner>>();

  columns = input<FlTableColumnStatic<HaPartner>[]>([
    'name',
    'certified',
    'created',
    'lastModified',
    'actions',
  ]);

  action = output<HaAdminPanelPartnersTableActionEvent>();

  certifyAction: HaAdminPanelTableAction = {
    type: 'certify_partner',
    icon: 'verified',
    tooltip: 'certify_partner',
  };

  decertifyAction: HaAdminPanelTableAction = {
    type: 'decertify_partner',
    icon: 'verified_disabled',
    tooltip: 'decertify_partner',
  };

  grantCertification(partner: HaPartner): void {
    this.action.emit({ type: this.certifyAction.type, partner: partner });
  }

  revokeCertification(partner: HaPartner): void {
    this.action.emit({ type: this.decertifyAction.type, partner: partner });
  }
}
