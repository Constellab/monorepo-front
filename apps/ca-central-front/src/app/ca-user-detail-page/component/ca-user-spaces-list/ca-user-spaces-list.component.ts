import { Component, Input, OnInit, inject } from '@angular/core';
import { CaSpaceService } from '../../../ca-core/service-api/ca-space.service';
import { CaSpace } from '../../../ca-core/model/entities/space/ca-space.class';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlEntityArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { CaSpaceTableComponent } from '../../../ca-core/entity-module/ca-space-core/component/ca-space-table/ca-space-table.component';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Accessible by admin to list space of a user
 */
@Component({
  selector: 'ca-user-spaces-list',
  templateUrl: './ca-user-spaces-list.component.html',
  styleUrls: ['./ca-user-spaces-list.component.scss'],
  imports: [FlCardModule, FlTextIconModule, MatIcon, FlIconModule, CaSpaceTableComponent, TranslatePipe],
})
export class CaUserSpacesListComponent implements OnInit {
  private spaceService = inject(CaSpaceService);

  @Input() userId: string;

  datasource: FlArrayObs<CaSpace>;

  ngOnInit(): void {
    this.datasource = new FlEntityArrayObs(this.spaceService.getSpacesOfUser(this.userId));
  }
}
