import { Component, Input, OnInit, inject } from '@angular/core';
import { CaSpaceService } from '../../../ca-core/service-api/ca-space.service';
import { CaSpace } from '../../../ca-core/model/entities/space/ca-space.class';
import { FlArrayObs, FlEntityArrayObs } from '@monorepo/front-core-lib';

/**
 * Accessible by admin to list space of a user
 */
@Component({
  selector: 'ca-user-spaces-list',
  templateUrl: './ca-user-spaces-list.component.html',
  styleUrls: ['./ca-user-spaces-list.component.scss'],
  standalone: false,
})
export class CaUserSpacesListComponent implements OnInit {
  private spaceService = inject(CaSpaceService);

  @Input() userId: string;

  datasource: FlArrayObs<CaSpace>;

  ngOnInit(): void {
    this.datasource = new FlEntityArrayObs(this.spaceService.getSpacesOfUser(this.userId));
  }
}
