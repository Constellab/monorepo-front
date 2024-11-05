import { Component, Input, OnInit } from '@angular/core';
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
})
export class CaUserSpacesListComponent implements OnInit {
  @Input() userId: string;

  datasource: FlArrayObs<CaSpace>;

  constructor(private spaceService: CaSpaceService) {}

  ngOnInit(): void {
    this.datasource = new FlEntityArrayObs(this.spaceService.getSpacesOfUser(this.userId));
  }
}
