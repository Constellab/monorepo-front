import { Component, Input } from '@angular/core';
import { FlTableColumnStatic } from '@monorepo/front-core-lib';
import { CaGroup, CaGroupDatasource } from '../../../../model/entities/ca-group.entity';

@Component({
  selector: 'ca-team-table',
  templateUrl: './ca-team-table.component.html',
  styleUrls: ['./ca-team-table.component.scss']
})
export class CaTeamTableComponent {

  @Input() datasource: CaGroupDatasource;

  @Input() columns: FlTableColumnStatic<CaGroup>[] = ['label', 'creation', 'actions'];

  onTeamDeleted(team: CaGroup): void {
    this.datasource.removeItem(team);
  }

}
