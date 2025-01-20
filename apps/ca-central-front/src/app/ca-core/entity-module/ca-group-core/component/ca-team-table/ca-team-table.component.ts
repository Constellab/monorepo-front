import { Component, Input } from '@angular/core';
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { CaGroup } from '../../../../model/entities/ca-group.entity';

@Component({
    selector: 'ca-team-table',
    templateUrl: './ca-team-table.component.html',
    styleUrls: ['./ca-team-table.component.scss'],
    standalone: false
})
export class CaTeamTableComponent {
  @Input({ required: true }) datasource: FlArrayObs<CaGroup>;

  @Input() columns: FlTableColumnStatic<CaGroup>[] = ['label', 'creation', 'actions'];

  onTeamDeleted(team: CaGroup): void {
    this.datasource.removeItem(team);
  }
}
