import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FlCorePipeModule, FlDialogService, FlPortalService, FlTagModule } from '@monorepo/front-core-lib';
import { LabEntityTagType, LabTag, LabTagDatasource } from '../../../../model/entities/lab-tag.entity';
import { LabManageEntityTagsDialogInput } from '../lab-manage-entity-tags-dialog/lab-manage-entity-tags-dialog.component';
import { ClHelpService } from '@monorepo/core-lib';
import {
  LabTagDetailPortalComponent,
  LabTagDetailPortalInput,
} from '../lab-tag-detail-portal/lab-tag-detail-portal.component';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'lab-tag-list',
  templateUrl: './lab-tag-list.component.html',
  styleUrls: ['./lab-tag-list.component.scss'],
  imports: [FlTagModule, MatTooltip, TranslatePipe, FlCorePipeModule, AsyncPipe, MatIcon, MatIconButton],
})
export class LabTagListComponent implements OnInit {
  private dialogService = inject(FlDialogService);
  private portalService = inject(FlPortalService);

  @Input({ required: true }) tags: LabTagDatasource;

  @Input() tagSelectable: boolean = false;

  @Input() showNoTagMessage: boolean = false;

  @Input() mode: 'show' | 'edit' = 'show';

  // when the entity info are provided, the manage entity tag dialog can be opened
  @Input() entityType: LabEntityTagType;
  @Input() entityId: string;

  @Output() tagDeleted: EventEmitter<LabTag> = new EventEmitter();

  ngOnInit(): void {
    if (this.tags == null) {
      console.error('[LabTagListComponent] Tags is null');
    }
  }

  get entityInformationProvided(): boolean {
    return this.entityType != null && this.entityId != null;
  }

  async openManageEntityTagDialog(): Promise<void> {
    if (!this.entityInformationProvided) return;

    // Lazy load the dialog component to avoid circular dependencies
    // because the dialog uses lab-tag-list component
    const componentType = await import(
      '../lab-manage-entity-tags-dialog/lab-manage-entity-tags-dialog.component'
    ).then((m) => m.LabManageEntityTagsDialogComponent);

    const data: LabManageEntityTagsDialogInput = {
      entityType: this.entityType,
      entityId: this.entityId,
      tags: this.tags,
    };
    this.dialogService.openSmallDialog(componentType, {
      data: data,
    });
  }

  showTagDetail(tag: LabTag, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    const config = this.portalService.configureRelativePortalFromMouseEvent(
      event,
      ['bottom', 'right', 'top', 'left'],
      {
        disposeOnNavigation: true,
        disposeOnOutsideClick: true,
      }
    );

    const data: LabTagDetailPortalInput = {
      entityTagId: tag.id,
    };
    this.portalService.createPortal(LabTagDetailPortalComponent, config, data);
  }

  deleteTag(tag: LabTag): void {
    this.tagDeleted.next(tag);
  }
}
