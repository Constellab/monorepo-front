import { FlBaseActionMenu, FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { LiEntityTagType, LiTagDatasource } from '@monorepo/lab-lib/li-core';
import { LiManageEntityTagsDialogComponent, LiManageEntityTagsDialogInput } from '../li-tag';

export class LiEntityActionMenu<T> extends FlBaseActionMenu<T> {
  protected getTagsButton(
    entityType: LiEntityTagType,
    entityId: string,
    tags: LiTagDatasource
  ): FlMenuDynamic {
    return {
      type: 'button',
      text: 'tags',
      icon: 'tag',
      onClick: () => this.openTagsFormDialog(entityId, entityType, tags),
    };
  }

  private openTagsFormDialog(entityId: string, entityType: LiEntityTagType, tags: LiTagDatasource): void {
    const data: LiManageEntityTagsDialogInput = {
      entityType: entityType,
      entityId: entityId,
      tags: tags,
    };

    this.injector
      .get(FlDialogService)
      .openSmallDialog(LiManageEntityTagsDialogComponent, { data: data })
      .afterClosed()
      .subscribe(() => this.subject.complete());
  }
}
