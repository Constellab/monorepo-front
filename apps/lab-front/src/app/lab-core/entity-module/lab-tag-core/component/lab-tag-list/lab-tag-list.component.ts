import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FlDialogService, FlTagColorer, FlTagSelectedEvent} from '@monorepo/front-core-lib';
import {LabEntityTagType, LabTag, LabTagDatasource} from '../../../../model/entities/lab-tag.entity';
import {
  LabManageEntityTagsDialogComponent,
  LabManageEntityTagsDialogInput
} from '../lab-manage-entity-tags-dialog/lab-manage-entity-tags-dialog.component';
import {LabTagService} from '../../../../entity-service/lab-tag.service';


@Component({
  selector: 'lab-tag-list',
  templateUrl: './lab-tag-list.component.html',
  styleUrls: ['./lab-tag-list.component.scss'],
})
export class LabTagListComponent implements OnInit{
  @Input() tags: LabTagDatasource;

  @Input() tagSelectable: boolean = false;

  @Input() limitNumber: number = Infinity;

  @Input() showNoTagMessage: boolean = false;

  @Input() tagColorer?: FlTagColorer;

  @Input() mode: 'show' | 'edit' = 'show';

  // when the entity info are provided, the manage entity tag dialog can be opened
  @Input() entityType: LabEntityTagType;
  @Input() entityId: string;

  @Output() tagSelected: EventEmitter<FlTagSelectedEvent> = new EventEmitter();

  @Output() tagDeleted: EventEmitter<LabTag> = new EventEmitter();

  constructor(private dialogService: FlDialogService,
              private tagService: LabTagService) {
  }

  ngOnInit(): void {
    if (!this.tags && this.entityInformationProvided) {
      this.tags = this.tagService.getEntityTagsDatasource(this.entityType, this.entityId);
    }

    if(this.tags == null){
      console.error("[LabTagListComponent] Tags is null");
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

  selectTag(tag: LabTag, event: MouseEvent): void {
    this.tagSelected.next({
      tag: tag,
      event: event
    });
  }

  deleteTag(tag: LabTag): void {
    this.tagDeleted.next(tag);
  }
}
