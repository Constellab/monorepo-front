import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy,Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ClHelpService } from '@monorepo/core-lib';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { LiEntityTagType, LiTag, LiTagDatasource } from '@monorepo/lab-lib/li-core';

import { LiManageEntityTagsDialogInput } from '../li-manage-entity-tags-dialog/li-manage-entity-tags-dialog.component';
import {
  LiTagDetailPortalComponent,
  LiTagDetailPortalInput,
} from '../li-tag-detail-portal/li-tag-detail-portal.component';

@Component({
  selector: 'li-tag-list',
  templateUrl: './li-tag-list.component.html',
  styleUrls: ['./li-tag-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlTagModule,
    MatTooltip,
    FlTranslateModule,
    FlCorePipeModule,
    AsyncPipe,
    MatIcon,
    MatButton,
    MatIconButton,
    NgClass,
  ],
})
export class LiTagListComponent implements OnInit {
  private dialogService = inject(FlDialogService);
  private portalService = inject(FlPortalService);

  @Input({ required: true }) tags: LiTagDatasource;

  /**
   * If true, the user can click on the tag to see the detail (including the tag origins)
   */
  @Input() enableDetails: boolean = false;

  @Input() showNoTagMessage: boolean = false;

  @Input() mode: 'show' | 'edit' = 'show';

  // when the entity info are provided, the manage entity tag dialog can be opened
  @Input() entityType: LiEntityTagType;
  @Input() entityId: string;

  @Output() tagDeleted: EventEmitter<LiTag> = new EventEmitter();

  ngOnInit(): void {
    if (this.tags == null) {
      console.error('[LiTagListComponent] Tags is null');
    }
  }

  get entityInformationProvided(): boolean {
    return this.entityType != null && this.entityId != null;
  }

  async openManageEntityTagDialog(): Promise<void> {
    if (!this.entityInformationProvided) return;

    // Lazy load the dialog component to avoid circular dependencies
    // because the dialog uses li-tag-list component
    const componentType =
      await import('../li-manage-entity-tags-dialog/li-manage-entity-tags-dialog.component').then(
        (m) => m.LiManageEntityTagsDialogComponent
      );

    const data: LiManageEntityTagsDialogInput = {
      entityType: this.entityType,
      entityId: this.entityId,
      tags: this.tags,
    };
    this.dialogService.openSmallDialog(componentType, {
      data: data,
    });
  }

  showTagDetail(tag: LiTag, event: MouseEvent): void {
    if (!this.enableDetails) return;
    ClHelpService.stopEventPropagation(event);
    const config = this.portalService.configureRelativePortalFromMouseEvent(
      event,
      ['bottom', 'right', 'top', 'left'],
      {
        disposeOnNavigation: true,
        disposeOnOutsideClick: true,
      }
    );

    const data: LiTagDetailPortalInput = {
      tagKey: tag.key,
      tagValue: tag.value?.toString(),
      tagEntityId: tag.id,
    };
    this.portalService.createPortal(LiTagDetailPortalComponent, config, data);
  }

  deleteTag(tag: LiTag): void {
    this.tagDeleted.next(tag);
  }
}
