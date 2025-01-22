import { Component } from '@angular/core';
import { CaTeamSearchComponent } from '../../../../ca-core/entity-module/ca-group-core/component/ca-team-search/ca-team-search.component';

@Component({
  selector: 'ca-current-space-teams-page',
  templateUrl: './ca-current-space-teams-page.component.html',
  styleUrls: ['./ca-current-space-teams-page.component.scss'],
  imports: [CaTeamSearchComponent],
})
export class CaCurrentSpaceTeamsPageComponent {}
