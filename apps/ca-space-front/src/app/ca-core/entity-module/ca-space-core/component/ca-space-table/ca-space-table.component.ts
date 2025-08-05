import { Component, Input } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
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
import { FlDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { CaSpace } from '../../../../model/entities/space/ca-space.class';
import { CaRouterService } from '../../../../service/ca-router.service';
import { CaExternalSpaceLinkDirective } from '../../pipe/ca-external-space-link.directive';
import { CaSpaceInlineComponent } from '../ca-space-inline/ca-space-inline.component';

@Component({
  selector: 'ca-space-table',
  templateUrl: './ca-space-table.component.html',
  styleUrls: ['./ca-space-table.component.scss'],
  imports: [
    MatTable,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    CaSpaceInlineComponent,
    FlUserModule,
    MatAnchor,
    CaExternalSpaceLinkDirective,
    MatIcon,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
  ],
})
export class CaSpaceTableComponent {
  @Input({ required: true }) datasource: FlDatasource<CaSpace>;

  @Input() columns: FlTableColumnStatic<CaSpace>[] = ['name', 'created', 'lastModified', 'type', 'detail'];

  currentSpaceRoute = CaRouterService.getCurrentSpaceRoute();
}
