import {Component, EventEmitter, Input, OnInit, Optional, Output, Self} from '@angular/core';
import {FlFormFieldDirective} from '@monorepo/front-core-lib';
import {LabTypeEntity, LabTypeEntityDatasource} from '../../../../model/entities/lab-type/lab-type.entity';
import {NgControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {LabTypeService} from '../../../../entity-service/lab-type.service';
import {TdTypeObjectType} from '@monorepo/technical-doc';

/**
 * Select component for LabType
 */
@Component({
  selector: 'lab-select-type',
  templateUrl: './lab-select-type.component.html',
  styleUrls: ['./lab-select-type.component.scss'],
  providers: [{provide: FlFormFieldDirective, useExisting: LabSelectTypeComponent}]

})
export class LabSelectTypeComponent extends FlFormFieldDirective<LabTypeEntity>
  implements OnInit {

  @Input() placeholder: string;

  @Input() objectType: TdTypeObjectType;

  @Output() typeChange: EventEmitter<LabTypeEntity> = new EventEmitter();

  selectedType: LabTypeEntity | Observable<LabTypeEntity>;

  datasource: LabTypeEntityDatasource;

  constructor(@Optional() @Self() ngControl: NgControl,
              private typeService: LabTypeService) {
    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = this.typeService.searchTypeByNameDatasource(this.objectType);
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

  onDisableChange(disable: boolean): void {
  }

}
