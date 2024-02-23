import {Component, Input, OnInit} from '@angular/core';
import {LabProtocolTemplate} from '../../../../lab-core/model/entities/process/lab-protocol-template.entity';
import {LabProtocolTemplateService} from '../../../../lab-core/entity-service/lab-protocol-template.service';
import {FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService} from '@monorepo/front-core-lib';
import {LabRouterService} from '../../../../lab-core/service/lab-router.service';

@Component({
  selector: 'lab-protocol-template-detail-header',
  templateUrl: './lab-protocol-template-detail-header.component.html',
  styleUrl: './lab-protocol-template-detail-header.component.scss'
})
export class LabProtocolTemplateDetailHeaderComponent implements OnInit{

  @Input() template: LabProtocolTemplate;

  downloadUrl: string;


  constructor(private protocolTemplateService: LabProtocolTemplateService,
              private dialogService: FlDialogService,
              private routerService: LabRouterService) {
  }

  ngOnInit(): void {
    this.downloadUrl = this.protocolTemplateService.getProtocolTemplateDownloadUrl(this.template.id);
  }


  updateName(name: string): void {
    this.protocolTemplateService.updateProtocolTemplateName(this.template.id, name).subscribe(
      (updatedProtocolTemplate: LabProtocolTemplate) => {
        this.template.name = updatedProtocolTemplate.name;
      }
    );
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
      this.routerService.navigateToProtocolTemplates();
    }
  }
}
