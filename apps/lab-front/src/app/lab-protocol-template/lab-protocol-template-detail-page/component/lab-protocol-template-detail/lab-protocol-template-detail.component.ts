import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {LabProtocolTemplate} from '../../../../lab-core/model/entities/process/lab-protocol-template.entity';
import {FlDebouncer, FlDialogService} from '@monorepo/front-core-lib';
import {LabProtocolTemplateService} from '../../../../lab-core/entity-service/lab-protocol-template.service';
import {TeBasicConfig, TeRichTextContent} from '@monorepo/text-editor';
import {LabTagService} from '../../../../lab-core/entity-service/lab-tag.service';
import {LabTagDatasource} from '../../../../lab-core/model/entities/lab-tag.entity';
import {
  LabManageEntityTagsDialogComponent,
  LabManageEntityTagsDialogInput
} from '../../../../lab-core/entity-module/lab-tag-core/component/lab-manage-entity-tags-dialog/lab-manage-entity-tags-dialog.component';

@Component({
  selector: 'lab-protocol-template-detail',
  templateUrl: './lab-protocol-template-detail.component.html',
  styleUrls: ['./lab-protocol-template-detail.component.scss']
})
export class LabProtocolTemplateDetailComponent implements OnInit, OnDestroy {

  @Input() template: LabProtocolTemplate;

  tags$: LabTagDatasource;


  textEditorConfig: TeBasicConfig = new TeBasicConfig();
  private descriptionDebouncer: FlDebouncer<TeRichTextContent>;

  constructor(private protocolTemplateService: LabProtocolTemplateService,
              private tagService: LabTagService,
              private dialogService: FlDialogService) {

  }

  ngOnInit(): void {
    // create a debouncer to save the description after x second of idle
    this.descriptionDebouncer = new FlDebouncer(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME);
    this.descriptionDebouncer.getDebouncedValue().subscribe(
      value => this.saveDescription(value)
    );

    this.tags$ = this.tagService.getEntityTagsDatasource('PROTOCOL_TEMPLATE', this.template.id);

  }

  onDescriptionChanged(value: TeRichTextContent): void {
    this.descriptionDebouncer.setValue(value);
  }

  saveDescription(description: TeRichTextContent): void {
    this.protocolTemplateService.updateProtocolTemplate(this.template.id, {description: description}).subscribe();
  }

  openTagsFormDialog(): void {
    const data: LabManageEntityTagsDialogInput = {
      entityType: 'PROTOCOL_TEMPLATE',
      entityId: this.template.id,
      tags: this.tags$
    };

    this.dialogService.openSmallDialog(LabManageEntityTagsDialogComponent, {data: data});
  }


  ngOnDestroy(): void {
    this.descriptionDebouncer.markForComplete();
  }
}
