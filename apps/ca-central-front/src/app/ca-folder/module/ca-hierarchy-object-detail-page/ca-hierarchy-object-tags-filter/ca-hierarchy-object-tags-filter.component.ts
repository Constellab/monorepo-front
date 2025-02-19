import { Component, inject, OnInit, output } from '@angular/core';
import {
  CaHierarchyObjectDetailState,
} from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaTagService } from '../../../../ca-core/service-api/ca-tag.service';
import { FlTag, FlTagModule, FlTagService } from '@monorepo/front-core-lib/fl-tag';
import { Observable } from 'rxjs';
import { CaHierarchyObjectType } from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { MatDivider } from '@angular/material/divider';
import { FlMenuDynamic, FlMenuDynamicService } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { CaAvailableTagDatasource, CaTagKey } from '../../../../ca-core/model/entities/ca-tag.class';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlFormFieldDirective } from '@monorepo/front-core-lib/fl-core';
import { NgControl } from '@angular/forms';

/**
 * Component to show the tags filter to filter in a folder content.
 * It is only activated when the user is in a folder.
 */
@Component({
  selector: 'ca-hierarchy-object-tags-filter',
  imports: [
    AsyncPipe,
    FlCorePipeModule,
    FlInfiniteScrollModule,
    FlTagModule,
    MatDivider,
    FlTextIconModule,
    TranslatePipe,
    MatIconModule,
    FlIconModule,
  ],
  templateUrl: './ca-hierarchy-object-tags-filter.component.html',
  styleUrl: './ca-hierarchy-object-tags-filter.component.scss',
  // provide the tag service for the fl-add-tag-input component
  providers: [
    {
      provide: FlTagService,
      useClass: CaTagService,
    },
  ],
})
export class CaHierarchyObjectTagsFilterComponent extends FlFormFieldDirective<FlTag> implements OnInit {
  private state = inject(CaHierarchyObjectDetailState);
  private dynamicMenuService = inject(FlMenuDynamicService);

  tagChange = output<FlTag>();

  showTags$: Observable<boolean>;

  tags: CaAvailableTagDatasource;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });
    super(ngControl);
  }

  ngOnInit(): void {
    this.tags = this.state.getChildrenAvailableTags();

    this.showTags$ = this.state
      .getHierarchyObject$()
      .pipe(
        map(
          (hierarchyObject) => hierarchyObject && hierarchyObject.objectType === CaHierarchyObjectType.FOLDER
        )
      );
  }

  openValueMenu(tag: CaTagKey, event: MouseEvent): void {
    const menus: FlMenuDynamic[] = tag.values.map((value) => {
      return {
        type: 'button',
        text: { text: value as string, translateText: false },
        onClick: () => this.selectTag({ key: tag.key, value }),
      };
    });

    menus.unshift({
      type: 'button',
      text: { text: 'all_tag_values', translateText: true },
      onClick: () => this.selectTag({ key: tag.key, value: undefined }),
      color: 'primary',
    });

    this.dynamicMenuService.openDynamicMenuFromMouseEvent(menus, event);
  }

  selectTag(tag: FlTag): void {
    this.setAndEmitValue(tag);
  }

  deleteTag(): void {
    this.setAndEmitValue(null);
  }

  callChangeEvent(value: FlTag): void {
    this.tagChange.emit(value);
  }

  onDisableChange(): void {}

  writeValue(obj: FlTag): void {
    this.value = obj;
  }
}
