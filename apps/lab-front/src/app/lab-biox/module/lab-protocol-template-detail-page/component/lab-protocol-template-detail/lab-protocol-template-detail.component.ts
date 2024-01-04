import {Component, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {LabProtocolTemplate} from '../../../../../lab-core/model/entities/process/lab-protocol-template.entity';
import {
  PrConfigViewEmpty,
  PrWorkflow,
  PrWorkflowActionState,
  PrWorkflowFactory,
  PrWorkflowMode,
  PrWorkflowResourcesState
} from '@monorepo/protocol';
import {Observable, of} from 'rxjs';
import {ClStringHelper} from '@monorepo/core-lib';
import {FlConfirmDialogInput, FlConfirmDialogResult, FlDebouncer, FlDialogService} from '@monorepo/front-core-lib';
import {
  LabProtocolTemplateFormDialogComponent,
  LabProtocolTemplateFormDialogInput
} from '../../../../../lab-core/entity-module/lab-protocol-template-core/component/lab-protocol-template-form-dialog/lab-protocol-template-form-dialog.component';
import {LabProtocolTemplateService} from '../../../../../lab-core/entity-service/lab-protocol-template.service';
import {LabRouterService} from '../../../../../lab-core/service/lab-router.service';
import {TeBasicConfig, TeTextEditorContent} from '@monorepo/text-editor';

@Component({
  selector: 'lab-protocol-template-detail',
  templateUrl: './lab-protocol-template-detail.component.html',
  styleUrls: ['./lab-protocol-template-detail.component.scss']
})
export class LabProtocolTemplateDetailComponent implements OnInit, OnDestroy {


  @Input() template: LabProtocolTemplate;

  viewConfig = new PrConfigViewEmpty();
  workflow: PrWorkflow;
  workflowMode$: Observable<PrWorkflowMode> = of('readOnly');

  downloadUrl: string;

  textEditorConfig: TeBasicConfig = new TeBasicConfig();
  private descriptionDebouncer: FlDebouncer<TeTextEditorContent>;


  constructor(private actionState: PrWorkflowActionState,
              private ngZone: NgZone,
              private workflowResourcesState: PrWorkflowResourcesState,
              private dialogService: FlDialogService,
              private protocolTemplateService: LabProtocolTemplateService,
              private routerService: LabRouterService) {

  }

  ngOnInit(): void {
    this.downloadUrl = this.protocolTemplateService.getProtocolTemplateDownloadUrl(this.template.id);
    this.actionState.init();
    const factory = new PrWorkflowFactory(this.template.data, ClStringHelper.generateUUID(),
      this.ngZone, this.workflowResourcesState);
    this.workflow = factory.createWorkflow();

    // create a debouncer to save the description after x second of idle
    this.descriptionDebouncer = new FlDebouncer(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME);
    this.descriptionDebouncer.getDebouncedValue().subscribe(
      value => this.saveDescription(value)
    );
  }

  onDescriptionChanged(value: TeTextEditorContent): void {
    this.descriptionDebouncer.setValue(value);
  }

  saveDescription(description: TeTextEditorContent): void {
    this.protocolTemplateService.updateProtocolTemplate(this.template.id, {description: description}).subscribe();
  }

  openUpdateDialog(): void {
    const input: LabProtocolTemplateFormDialogInput = {
      mode: 'update',
      object: this.template
    };

    this.dialogService.openSmallDialog(LabProtocolTemplateFormDialogComponent, {data: input}).afterClosed().subscribe(
      (res: LabProtocolTemplate) => this.onUpdateDialogClosed(res)
    );
  }

  private onUpdateDialogClosed(template?: LabProtocolTemplate): void {
    if (template) {
      this.template.name = template.name;
      this.template.description = template.description;
    }
  }

  openDeleteDialog(): void {
    const data: FlConfirmDialogInput = {
      title: 'biox.delete_protocol_template',
      content: 'biox.delete_protocol_template_confirmation',
      translateTitleAndContent: true,
      observable: this.protocolTemplateService.deleteProtocolTemplate(this.template.id),
      successMessage: 'biox.protocol_template_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(data).afterClosed().subscribe(
      (res: FlConfirmDialogResult) => this.onDeleteClosed(res)
    );
  }

  private onDeleteClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.routerService.navigateToExperimentListRoute();
    }
  }

  ngOnDestroy(): void {
    this.actionState.clear();
    this.descriptionDebouncer.markForComplete();
  }
}
