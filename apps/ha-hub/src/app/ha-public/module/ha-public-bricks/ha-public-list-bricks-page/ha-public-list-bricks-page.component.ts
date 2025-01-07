import { Component, inject, makeStateKey, OnInit, StateKey } from '@angular/core';
import { HaBrickService } from '../../../../ha-core/ha-service/ha-brick.service';
import {
  HaBrick,
  HaBrickDatasourceFilters,
  HaBrickDatasourcePaginated,
} from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaRouterService } from '../../../../ha-core/ha-service/ha-router.service';
import { FormControl } from '@angular/forms';
import { HaUser } from '../../../../ha-core/ha-model/ha-entities/ha-user';
import { HaAuthenticatedUserService } from '../../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaCommunityPage } from '../../../../ha-core/utils/ha-community.page';

@Component({
  selector: 'ha-public-list-bricks-page',
  templateUrl: './ha-public-list-bricks-page.component.html',
  styleUrls: ['./ha-public-list-bricks-page.component.scss'],
})
export class HaPublicListBricksPageComponent extends HaCommunityPage implements OnInit {
  private haBrickService: HaBrickService = inject(HaBrickService);
  private authenticatedUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);

  bricks: HaBrickDatasourcePaginated<HaBrickDatasourceFilters>;
  BRICKS_KEY: StateKey<object>;
  spaceIdFilter: string[] = [];
  titleFormControl: FormControl<string> = new FormControl('');
  user: HaUser;

  ngOnInit(): void {
    this.authenticatedUserService.getUser().subscribe((user) => {
      this.user = user;
    });

    super.setMetaTags(
      'ha.bricks.title',
      'ha.bricks.description',
      null,
      HaRouterService.getFullRoute(HaRouterService.getBrickListRoute())
    );

    this.BRICKS_KEY = makeStateKey('bricks');

    this.bricks = this.haBrickService.getAllWithFiltersPaginated();

    this.updateBricks();
  }

  getBrickRoute(brick: HaBrick): string {
    return HaRouterService.getBrickPageRoute(brick.name);
  }

  search(event: any): void {
    event.preventDefault();
    this.updateBricks();
  }

  updateBricks(): void {
    this.bricks.getFirstPage({
      spacesFilter: this.spaceIdFilter,
      titleFilter: this.titleFormControl.value,
    });
  }

  isSelected(spaceId: string): boolean {
    return this.spaceIdFilter.find((id) => id == spaceId) != null;
  }

  selectSpace(spaceId: string): void {
    if (this.isSelected(spaceId)) {
      this.spaceIdFilter = this.spaceIdFilter.filter((id) => id != spaceId);
    } else {
      this.spaceIdFilter.push(spaceId);
    }
    this.updateBricks();
  }

  onSpace(spaceId: string): void {
    this.selectSpace(spaceId);
  }
}
