import { Component, OnInit, inject } from '@angular/core';
import { mergeMap, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CaGroupService } from '../../../../ca-core/service-api/ca-group.service';
import { CaGroup } from '../../../../ca-core/model/entities/ca-group.entity';
import { FlSectionModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { CaTeamDetailComponent } from '../ca-team-detail/ca-team-detail.component';

/**
 * Page to show the detail of a team
 */
@Component({
  selector: 'ca-team-page',
  templateUrl: './ca-team-page.component.html',
  styleUrls: ['./ca-team-page.component.scss'],
  imports: [FlSectionModule, CaTeamDetailComponent],
})
export class CaTeamPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private groupService = inject(CaGroupService);

  teams$: Observable<CaGroup>;

  ngOnInit(): void {
    this.teams$ = this.route.params.pipe(mergeMap((params) => this.groupService.getTeamById(params.id)));
  }
}
