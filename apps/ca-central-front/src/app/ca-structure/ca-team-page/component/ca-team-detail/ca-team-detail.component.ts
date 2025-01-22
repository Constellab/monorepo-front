import { Component, Input, OnInit, inject } from '@angular/core';
import { CaGroup } from '../../../../ca-core/model/entities/ca-group.entity';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';

/**
 * Show detail of a team
 */
@Component({
  selector: 'ca-team-detail',
  templateUrl: './ca-team-detail.component.html',
  styleUrls: ['./ca-team-detail.component.scss'],
  standalone: false,
})
export class CaTeamDetailComponent implements OnInit {
  private routerService = inject(CaRouterService);

  @Input() team: CaGroup;

  ngOnInit(): void {}

  onTeamDeleted(): void {
    this.routerService.navigateToMyTeams();
  }
}
