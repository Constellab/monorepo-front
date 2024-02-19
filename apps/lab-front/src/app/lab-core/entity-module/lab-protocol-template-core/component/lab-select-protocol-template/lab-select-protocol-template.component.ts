import {Component, EventEmitter, Input, OnInit, Optional, Output, Self} from '@angular/core';
import {FlDialogService, FlFormFieldDirective, FlInputSearchAdvancedButton} from '@monorepo/front-core-lib';
import {
  LabProtocolTemplate,
  LabProtocolTemplateDatasource
} from '../../../../model/entities/process/lab-protocol-template.entity';
import {NgControl} from '@angular/forms';
import {LabProtocolTemplateService} from '../../../../entity-service/lab-protocol-template.service';
import {
  LabSelectProtocolTemplateDialogComponent,
  LabSelectProtocolTemplateDialogInput
} from '../lab-select-protocol-template-dialog/lab-select-protocol-template-dialog.component';
import {Observable} from 'rxjs';

/**
 * Input/Select component to search for a Protocol template and select one.
 * It uses the FlInputSearchComponent to search for users.
 */
@Component({
  selector: 'lab-select-protocol-template',
  templateUrl: './lab-select-protocol-template.component.html',
  styleUrls: ['./lab-select-protocol-template.component.scss'],
  providers: [{provide: FlFormFieldDirective, useExisting: LabSelectProtocolTemplateComponent}]

})
export class LabSelectProtocolTemplateComponent extends FlFormFieldDirective<LabProtocolTemplate>
  implements OnInit {

  @Input() placeholder: string;

  @Output() valueChange: EventEmitter<LabProtocolTemplate> = new EventEmitter();

  selectedTemplate: LabProtocolTemplate;

  datasource: LabProtocolTemplateDatasource;

  advancedButton: FlInputSearchAdvancedButton<LabProtocolTemplate>;

  constructor(private protocolTemplateService: LabProtocolTemplateService,
              private dialogService: FlDialogService,
              @Optional() @Self() ngControl: NgControl) {
    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = this.protocolTemplateService.searchByNameDatasource();

    this.advancedButton = {
      onClick: () => this.openProtocolTemplateDialog(),
    };
  }

  private openProtocolTemplateDialog(): Observable<any> {
    const data: LabSelectProtocolTemplateDialogInput = {
      rowSelectable: true
    };
    return this.dialogService.openBigDialog(LabSelectProtocolTemplateDialogComponent, {data}).afterClosed();
  }

  callChangeEvent(value: LabProtocolTemplate): void {
    this.valueChange.emit(value);
    this.selectedTemplate = value;
  }

  onDisableChange(): void {
  }

  writeValue(obj: LabProtocolTemplate): void {
    if (obj == null || obj.id == null) {
      this.selectedTemplate = null;
      this.value = null;
      return;
    }
    // if the user is complete
    this.selectedTemplate = obj;

    this.value = obj;
  }

}
