import { AsyncPipe } from '@angular/common';
import { Component, inject, makeStateKey, OnInit, StateKey } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CoCommunityLibModule, CoListFiltersComponent } from '@monorepo/community-lib';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';

import { HaListOfItemsComponent } from '../../../ha-core/ha-component/ha-list-of-items/ha-list-of-items.component';
import { HaPageComponent } from '../../../ha-core/ha-component/ha-page/ha-page.component';
import {
  HaBrick,
  HaBrickDatasourceFilters,
  HaBrickDatasourcePaginated,
} from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaBrickImagePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-brick-image/ha-brick-image.pipe';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaBrickService } from '../../../ha-core/ha-service/ha-brick.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';

@Component({
  selector: 'ha-list-bricks-page',
  templateUrl: './ha-list-bricks-page.component.html',
  styleUrls: ['./ha-list-bricks-page.component.scss'],
  imports: [
    FlTextIconModule,
    FlInfiniteScrollModule,
    ReactiveFormsModule,
    FormsModule,
    CoCommunityLibModule,
    FlCorePipeModule,
    AsyncPipe,
    RouterLink,
    HaBrickImagePipe,
    HaListOfItemsComponent,
    HaPageComponent,
    CoListFiltersComponent,
  ],
})
export class HaListBricksPageComponent extends HaCommunityPageDirective implements OnInit {
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

  onSpacesChanged(spaces: string[]): void{
    this.spaceIdFilter = spaces;
    this.updateBricks();
  }

}
