import { Component, inject, makeStateKey, OnInit, StateKey } from '@angular/core';
import { HaBrickService } from '../../../../ha-core/ha-service/ha-brick.service';
import {
  HaBrick,
  HaBrickDatasourceFilters,
  HaBrickDatasourcePaginated,
} from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaRouterService } from '../../../../ha-core/ha-service/ha-router.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HaUser } from '../../../../ha-core/ha-model/ha-entities/ha-user';
import { HaAuthenticatedUserService } from '../../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaCommunityPageDirective } from '../../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaIsAuthenticatedDirective } from '../../../../ha-core/ha-module/ha-core-directive/ha-is-authenticated/ha-is-authenticated.directive';
import { MatIcon } from '@angular/material/icon';
import { HaSidenavButtonDirective } from '../../../../ha-core/ha-module/ha-core-directive/ha-sidenav-button/ha-sidenav-button.directive';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatChipOption } from '@angular/material/chips';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { HaSelectableSpaceListComponent } from '../../../../ha-space/module/ha-selectable-space-list/ha-selectable-space-list.component';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { HaBrickImagePipe } from '../../../../ha-core/ha-module/ha-core-pipe/ha-brick-image/ha-brick-image.pipe';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'ha-public-list-bricks-page',
  templateUrl: './ha-public-list-bricks-page.component.html',
  styleUrls: ['./ha-public-list-bricks-page.component.scss'],
  imports: [
    HaIsAuthenticatedDirective,
    MatIcon,
    HaSidenavButtonDirective,
    MatAnchor,
    RouterLink,
    MatButton,
    MatChipOption,
    FlTextIconModule,
    HaSelectableSpaceListComponent,
    FlInfiniteScrollModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatInput,
    MatIconButton,
    MatSuffix,
    MatTooltip,
    CoCommunityLibModule,
    AsyncPipe,
    TranslatePipe,
    FlCorePipeModule,
    HaBrickImagePipe,
    MatDivider,
  ],
})
export class HaPublicListBricksPageComponent extends HaCommunityPageDirective implements OnInit {
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
