import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { LabScenarioTemplate } from '../../../../model/entities/process/lab-scenario-template.entity';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { FlSearchModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-search/fl-search.module';
import { RouterLink } from '@angular/router';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { LabTagListComponent } from '../../../lab-tag-core/component/lab-tag-list/lab-tag-list.component';
import { MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { LabDetailRoutePipe } from '../../../../lab-core-pipe/lab-detail-route/lab-detail-route.pipe';
import { LabGetEntityTagsPipe } from '../../../lab-tag-core/pipe/lab-get-entity-tags.pipe';

@Component({
  selector: 'lab-scenario-template-table',
  templateUrl: './lab-scenario-template-table.component.html',
  styleUrls: ['./lab-scenario-template-table.component.scss'],
  imports: [
    MatTable,
    MatSort,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    RouterLink,
    FlUserModule,
    LabTagListComponent,
    MatAnchor,
    MatIcon,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
    LabDetailRoutePipe,
    LabGetEntityTagsPipe,
  ],
})
export class LabScenarioTemplateTableComponent {
  @Input({ required: true }) datasource: FlArrayObs<LabScenarioTemplate>;

  @Input() columns: FlTableColumnStatic<LabScenarioTemplate>[] = ['name', 'tags', 'lastModification'];

  @Input() rowSelectable: boolean = false;

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Output() templateSelected: EventEmitter<LabScenarioTemplate> = new EventEmitter();

  rowClicked(template: LabScenarioTemplate): void {
    if (this.rowSelectable) {
      this.templateSelected.emit(template);
    }
  }

  openInNewTab(event: MouseEvent): void {
    event.stopPropagation();
  }
}
