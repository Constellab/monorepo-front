import { FlBaseActionMenu, FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import {
  LabManageEntityTagsDialogComponent,
  LabManageEntityTagsDialogInput,
} from '../lab-tag-core/component/lab-manage-entity-tags-dialog/lab-manage-entity-tags-dialog.component';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { LabEntityTagType, LabTagDatasource } from '../../model/entities/lab-tag.entity';

export class LabEntityActionMenu<T> extends FlBaseActionMenu<T> {
  protected getTagsButton(
    entityType: LabEntityTagType,
    entityId: string,
    tags: LabTagDatasource
  ): FlMenuDynamic {
    return {
      type: 'button',
      text: 'tags',
      icon: 'tag',
      onClick: () => this.openTagsFormDialog(entityId, entityType, tags),
    };
  }

  private openTagsFormDialog(entityId: string, entityType: LabEntityTagType, tags: LabTagDatasource): void {
    const data: LabManageEntityTagsDialogInput = {
      entityType: entityType,
      entityId: entityId,
      tags: tags,
    };

    this.injector
      .get(FlDialogService)
      .openSmallDialog(LabManageEntityTagsDialogComponent, { data: data })
      .afterClosed()
      .subscribe(() => this.subject.complete());
  }
}
