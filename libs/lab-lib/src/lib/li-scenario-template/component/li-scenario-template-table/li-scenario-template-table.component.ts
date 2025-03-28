import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiDetailRoutePipe, LiScenarioTemplate } from '@monorepo/lab-lib/li-core';
import { MatAnchor } from '@angular/material/button';
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
import { MatIcon } from '@angular/material/icon';
import { MatSortHeader } from '@angular/material/sort';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LiGetEntityTagsPipe, LiTagListComponent } from '@monorepo/lab-lib/li-tag';

@Component({
  selector: 'li-scenario-template-table',
  templateUrl: './li-scenario-template-table.component.html',
  styleUrls: ['./li-scenario-template-table.component.scss'],
  imports: [
    MatTable,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    RouterLink,
    FlUserModule,
    LiTagListComponent,
    MatAnchor,
    MatIcon,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
    LiDetailRoutePipe,
    LiGetEntityTagsPipe,
  ],
})
export class LiScenarioTemplateTableComponent {
  @Input({ required: true }) datasource: FlArrayObs<LiScenarioTemplate>;

  @Input() columns: FlTableColumnStatic<LiScenarioTemplate>[] = ['name', 'tags', 'lastModification'];

  @Input() rowSelectable: boolean = false;

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Output() templateSelected: EventEmitter<LiScenarioTemplate> = new EventEmitter();

  rowClicked(template: LiScenarioTemplate): void {
    if (this.rowSelectable) {
      this.templateSelected.emit(template);
    }
  }

  openInNewTab(event: MouseEvent): void {
    event.stopPropagation();
  }
}
