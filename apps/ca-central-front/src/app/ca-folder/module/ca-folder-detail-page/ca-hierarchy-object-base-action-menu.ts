import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  FlBaseActionMenu,
  FlMenuDynamic,
  FlMenuDynamicService,
} from '@monorepo/front-core-lib/fl-menu-dynamic';
import { CaHierarchyObjectTagDatasource } from '../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { Subject } from 'rxjs';
import {
  CaHierarchyObjectTagsDialogComponent,
  CaHierarchyObjectTagsDialogInput,
} from '../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-tags-dialog/ca-hierarchy-object-tags-dialog.component';
import { CaAvailableTagDatasource } from '../../../ca-core/model/entities/ca-tag.class';

export interface CaHierarchyObjectActionTags {
  tags?: CaHierarchyObjectTagDatasource;
  availableTags?: CaAvailableTagDatasource;
}

/**
 * Base class to manage the action menu for a hierarchy object (folder, document, ...)
 * It contains common actions like manage tags
 */
export class CaHierarchyObjectBaseActionMenu<T> extends FlBaseActionMenu<T> {
  protected subject: Subject<T> = new Subject();

  constructor(
    protected dialogService: FlDialogService,
    protected menuDynamicService: FlMenuDynamicService,
    protected hierarchyObjectId: string,
    private tags?: CaHierarchyObjectActionTags
  ) {
    super(menuDynamicService);
  }

  protected getManageTagsButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'tags', translateText: true },
      icon: 'tag',
      onClick: () => this.openTagDialog(),
    };
  }

  private openTagDialog(): void {
    const data: CaHierarchyObjectTagsDialogInput = {
      hierarchyObjectId: this.hierarchyObjectId,
      tags: this.tags?.tags,
      availableTags: this.tags?.availableTags,
    };
    this.dialogService
      .openSmallDialog(CaHierarchyObjectTagsDialogComponent, { data: data })
      .afterClosed()
      .subscribe(() => this.subject.complete());
  }
}
