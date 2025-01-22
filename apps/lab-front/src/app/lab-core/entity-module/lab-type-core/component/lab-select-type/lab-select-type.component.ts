import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import {
  FlDialogService,
  FlFormFieldDirective,
  FlInputSearchAdvancedButton,
  FlInputSearchFilter,
} from '@monorepo/front-core-lib';
import { LabTypeEntity, LabTypeEntityDatasource } from '../../../../model/entities/lab-type/lab-type.entity';
import { NgControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { LabTypeService } from '../../../../entity-service/lab-type.service';
import { TdTypeObjectType } from '@monorepo/technical-doc';
import {
  LabSelectTypeDialogComponent,
  LabSelectTypeDialogInput,
} from '../lab-select-type-dialog/lab-select-type-dialog.component';

/**
 * Select component for LabType
 */
@Component({
  selector: 'lab-select-type',
  templateUrl: './lab-select-type.component.html',
  styleUrls: ['./lab-select-type.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LabSelectTypeComponent }],
  standalone: false,
})
export class LabSelectTypeComponent extends FlFormFieldDirective<LabTypeEntity> implements OnInit {
  private typeService = inject(LabTypeService);
  private dialogService = inject(FlDialogService);

  @Input() placeholder: string;

  @Input() mode: 'process' | 'resource' = 'process';

  @Output() typeChange: EventEmitter<LabTypeEntity> = new EventEmitter();

  selectedType: LabTypeEntity | Observable<LabTypeEntity>;

  datasource: LabTypeEntityDatasource<FlInputSearchFilter>;

  advancedButton: FlInputSearchAdvancedButton<LabTypeEntity>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  ngOnInit(): void {
    const objectTypes: TdTypeObjectType[] = this.mode === 'process' ? ['TASK', 'PROTOCOL'] : ['RESOURCE'];
    this.datasource = this.typeService.searchTypeByNameDatasource(objectTypes);

    const data: LabSelectTypeDialogInput = {
      searchConfig: {
        mode: this.mode,
      },
    };
    this.advancedButton = {
      onClick: () => this.dialogService.openBigDialog(LabSelectTypeDialogComponent, { data }).afterClosed(),
    };
  }

  writeValue(obj: LabTypeEntity): void {
    if (obj == null || obj.typingName == null) {
      this.selectedType = null;
      this.value = null;
      return;
    }

    // if the provided object is not complete, we need to fetch it
    if (obj.name == null) {
      this.selectedType = this.typeService.getTyping((obj as LabTypeEntity).typingName);
    } else {
      this.selectedType = obj;
    }
    this.value = obj;
  }

  callChangeEvent(value: LabTypeEntity): void {
    this.typeChange.next(value);
    this.selectedType = value;
  }

  onDisableChange(): void {}
}
