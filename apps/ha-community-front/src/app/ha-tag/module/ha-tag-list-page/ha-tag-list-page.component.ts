import { Component, inject, OnInit } from '@angular/core';
import { HaLeftPanelDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-left-panel/ha-left-panel.directive';
import { MatIcon } from '@angular/material/icon';
import { HaSidenavButtonDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-sidenav-button/ha-sidenav-button.directive';
import { MatButton, MatIconButton } from '@angular/material/button';
import { HaIsAuthenticatedDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-is-authenticated/ha-is-authenticated.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { HaTagService } from '../../../ha-core/ha-service/ha-tag.service';
import {
  HaTagKeyEditDialogComponent,
  HaTagKeyEditDialogInput,
} from '../ha-tag-key-edit-dialog/ha-tag-key-edit-dialog.component';
import { Router, RouterLink } from '@angular/router';
import {
  HaTagKey,
  HaTagKeyDatasourceFilters,
  HaTagKeyDatasourcePaginated,
} from '../../../ha-core/ha-model/ha-entities/ha-tag-key.class';
import { MatDivider } from '@angular/material/divider';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { AsyncPipe } from '@angular/common';
import { HaDetailRoutePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-detail-route/ha-detail-route.pipe';
import { CoCommunityTagListItemComponent } from '@monorepo/community-lib';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';

@Component({
  selector: 'ha-tag-list-page',
  imports: [
    HaLeftPanelDirective,
    MatIcon,
    HaSidenavButtonDirective,
    MatButton,
    HaIsAuthenticatedDirective,
    TranslatePipe,
    MatDivider,
    FlInfiniteScrollModule,
    FormsModule,
    MatFormField,
    MatIconButton,
    MatInput,
    MatSuffix,
    ReactiveFormsModule,
    MatTooltip,
    FlCorePipeModule,
    AsyncPipe,
    RouterLink,
    HaDetailRoutePipe,
    CoCommunityTagListItemComponent,
  ],
  templateUrl: './ha-tag-list-page.component.html',
  styleUrl: './ha-tag-list-page.component.scss',
  standalone: true,
})
export class HaTagListPageComponent extends HaCommunityPageDirective implements OnInit {
  private dialogService = inject(FlDialogService);
  private tagService = inject(HaTagService);
  private router: Router = inject(Router);

  tagsPaginated: HaTagKeyDatasourcePaginated<HaTagKeyDatasourceFilters>;
  spaceIdsFilter: string[] = [];
  labelFilterFormControl: FormControl<string> = new FormControl('');

  ngOnInit(): void {
    this.tagsPaginated = this.tagService.getAllWithFiltersPaginated();
    this.updateTags();

    super.setMetaTags(
      {
        text: 'ha.tag_list.title',
      },
      {
        text: 'ha.tag_list.description',
      },
      null,
      HaRouterService.getTagsListRoute()
    );
  }

  openCreateTagDialog(): void {
    const input: HaTagKeyEditDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openMediumDialog(HaTagKeyEditDialogComponent, { data: input })
      .afterClosed()
      .subscribe((tag: HaTagKey) => {
        if (tag) {
          this.router.navigate(['tags/', tag.id]);
        }
      });
  }

  isSpaceFilterSelected(selectedSpaceFilter: string): boolean {
    return this.spaceIdsFilter.find((id) => id == selectedSpaceFilter) != null;
  }

  selectSpaceFilter(selectedSpaceFilter: string): void {
    if (this.isSpaceFilterSelected(selectedSpaceFilter))
      this.spaceIdsFilter = this.spaceIdsFilter.filter((id) => id != selectedSpaceFilter);
    else this.spaceIdsFilter.push(selectedSpaceFilter);
    this.updateTags();
  }

  search(event: any): void {
    event.preventDefault();
    this.updateTags();
  }

  updateTags(): void {
    this.tagsPaginated.getFirstPage({
      spacesFilter: this.spaceIdsFilter,
      labelFilter: this.labelFilterFormControl.value,
    });
  }
}
