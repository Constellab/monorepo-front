import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlDialogService, FlPortalService } from '@monorepo/front-core-lib';
import { LabEntityTagType, LabTag, LabTagDatasource } from '../../../../model/entities/lab-tag.entity';
import {
  LabManageEntityTagsDialogComponent,
  LabManageEntityTagsDialogInput,
} from '../lab-manage-entity-tags-dialog/lab-manage-entity-tags-dialog.component';
import { ClHelpService } from '@monorepo/core-lib';
import {
  LabTagDetailPortalComponent,
  LabTagDetailPortalInput,
} from '../lab-tag-detail-portal/lab-tag-detail-portal.component';

@Component({
  selector: 'lab-tag-list',
  templateUrl: './lab-tag-list.component.html',
  styleUrls: ['./lab-tag-list.component.scss'],
})
export class LabTagListComponent implements OnInit {
  @Input({ required: true }) tags: LabTagDatasource;

  @Input() tagSelectable: boolean = false;

  @Input() showNoTagMessage: boolean = false;

  @Input() mode: 'show' | 'edit' = 'show';

  // when the entity info are provided, the manage entity tag dialog can be opened
  @Input() entityType: LabEntityTagType;
  @Input() entityId: string;

  @Output() tagDeleted: EventEmitter<LabTag> = new EventEmitter();

  constructor(
    private dialogService: FlDialogService,
    private portalService: FlPortalService
  ) {}

  ngOnInit(): void {
    if (this.tags == null) {
      console.error('[LabTagListComponent] Tags is null');
    }
  }

  get entityInformationProvided(): boolean {
    return this.entityType != null && this.entityId != null;
  }

  openManageEntityTagDialog(): void {
    if (!this.entityInformationProvided) return;

    const data: LabManageEntityTagsDialogInput = {
      entityType: this.entityType,
      entityId: this.entityId,
      tags: this.tags,
    };
    this.dialogService.openSmallDialog(LabManageEntityTagsDialogComponent, {
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
