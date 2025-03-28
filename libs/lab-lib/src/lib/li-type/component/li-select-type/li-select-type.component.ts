import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormFieldDirective, FlInputSearchFilter } from '@monorepo/front-core-lib/fl-core';
import { FlInputSearchAdvancedButton, FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import {
  LiSelectTypeDialogComponent,
  LiSelectTypeDialogInput,
} from '../li-select-type-dialog/li-select-type-dialog.component';
import { LiTypeEntity, LiTypeEntityDatasource, LiTypeService } from '@monorepo/lab-lib/li-core';
import { NgControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { TdTechnicalDocModule, TdTypeObjectType } from '@monorepo/technical-doc';

/**
 * Select component for LabType
 */
@Component({
  selector: 'li-select-type',
  templateUrl: './li-select-type.component.html',
  styleUrls: ['./li-select-type.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LiSelectTypeComponent }],
  imports: [FlInputSearchModule, TdTechnicalDocModule],
})
export class LiSelectTypeComponent extends FlFormFieldDirective<LiTypeEntity> implements OnInit {
  private typeService = inject(LiTypeService);
  private dialogService = inject(FlDialogService);

  @Input() placeholder: string;

  @Input() mode: 'process' | 'resource' = 'process';

  @Output() typeChange: EventEmitter<LiTypeEntity> = new EventEmitter();

  selectedType: LiTypeEntity | Observable<LiTypeEntity>;

  datasource: LiTypeEntityDatasource<FlInputSearchFilter>;

  advancedButton: FlInputSearchAdvancedButton<LiTypeEntity>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  ngOnInit(): void {
    const objectTypes: TdTypeObjectType[] = this.mode === 'process' ? ['TASK', 'PROTOCOL'] : ['RESOURCE'];
    this.datasource = this.typeService.searchTypeByNameDatasource(objectTypes);

    const data: LiSelectTypeDialogInput = {
      searchConfig: {
        mode: this.mode,
      },
    };
    this.advancedButton = {
      onClick: () => this.dialogService.openBigDialog(LiSelectTypeDialogComponent, { data }).afterClosed(),
    };
  }

  writeValue(obj: LiTypeEntity): void {
    if (obj == null || obj.typingName == null) {
      this.selectedType = null;
      this.value = null;
      return;
    }

    // if the provided object is not complete, we need to fetch it
    if (obj.name == null) {
      this.selectedType = this.typeService.getTyping((obj as LiTypeEntity).typingName);
    } else {
      this.selectedType = obj;
    }
    this.value = obj;
  }

  callChangeEvent(value: LiTypeEntity): void {
    this.typeChange.next(value);
    this.selectedType = value;
  }

  onDisableChange(): void {}
}
