import { Component, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';
import {
  FlDialogService,
  FlFormFieldDirective,
  FlInputSearchAdvancedButton,
  FlInputSearchFilter
} from '@monorepo/front-core-lib';
import { NgControl } from '@angular/forms';
import {
  LabDocumentTemplate,
  LabDocumentTemplateDatasource
} from '../../../../model/entities/lab-document-template.entity';
import { LabDocumentTemplateService } from '../../../../entity-service/lab-document-template.service';
import { Observable } from 'rxjs';
import {
  LabSelectDocumentTemplateDialogComponent,
  LabSelectDocumentTemplateDialogInput
} from '../lab-select-document-template-dialog/lab-select-document-template-dialog.component';

@Component({
  selector: 'lab-select-document-template',
  templateUrl: './lab-select-document-template.component.html',
  styleUrls: ['./lab-select-document-template.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LabSelectDocumentTemplateComponent }]
})
export class LabSelectDocumentTemplateComponent extends FlFormFieldDirective<LabDocumentTemplate> implements OnInit {

  @Input() placeholder: string;

  @Output() valueChange: EventEmitter<LabDocumentTemplate> = new EventEmitter();

  selectedDocumentTemplate: LabDocumentTemplate | Observable<LabDocumentTemplate>;

  datasource: LabDocumentTemplateDatasource<FlInputSearchFilter>;

  advancedButton: FlInputSearchAdvancedButton<LabDocumentTemplate>;

  constructor(private documentTemplateService: LabDocumentTemplateService,
              private dialogService: FlDialogService,
              @Optional() @Self() ngControl: NgControl) {
    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = this.documentTemplateService.searchByNameDatasource();

    const data: LabSelectDocumentTemplateDialogInput = { mode: 'selection' };
    this.advancedButton = {
      onClick: () => this.dialogService.openBigDialog(LabSelectDocumentTemplateDialogComponent, { data }).afterClosed()
    };
  }

  callChangeEvent(value: LabDocumentTemplate): void {
    this.valueChange.emit(value);
    this.selectedDocumentTemplate = value;
  }

  onDisableChange(): void {
  }

  writeValue(obj: LabDocumentTemplate): void {
    if (obj == null || (typeof obj != 'string' && obj.id == null)) {
      this.selectedDocumentTemplate = null;
      this.value = null;
      return;
    }

    if (typeof obj == 'string') {
      this.selectedDocumentTemplate = this.documentTemplateService.getDocumentTemplate(obj);
    } else if (!(obj instanceof LabDocumentTemplate)) {
      this.selectedDocumentTemplate = this.documentTemplateService.getDocumentTemplate((obj as any).id);
    } else {
      // if the user is complete
      this.selectedDocumentTemplate = obj;
    }

    this.value = obj;
  }

}

