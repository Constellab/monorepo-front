import { Component, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { FlEntityPaginatedDatasource, FlFormFieldDirective } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { NgControl } from '@angular/forms';
import { CaLabInstanceService } from '../../../../service-api/ca-lab-instance.service';
import { CaLabInstance, CaLabInstanceDatasource } from '../../../../model/entities/lab/ca-lab-instance.class';
import { map } from 'rxjs/operators';
import { CaLabInstanceSearchFields } from '../../model/ca-lab-instance-search.class';

@Component({
  selector: 'ca-select-lab',
  templateUrl: './ca-select-lab.component.html',
  styleUrls: ['./ca-select-lab.component.scss'],
  providers: [{provide: FlFormFieldDirective, useExisting: CaSelectLabComponent}]
})
export class CaSelectLabComponent extends FlFormFieldDirective<CaLabInstance> implements OnInit {

  @Input() mode: 'all' | 'all-cloud';

  @Input() placeholder: string;

  @Output() valueChange: EventEmitter<CaLabInstance> = new EventEmitter();

  selectedLab: CaLabInstance | Observable<CaLabInstance>;

  labDatasource: CaLabInstanceDatasource;

  constructor(private labInstanceService: CaLabInstanceService,
              @Optional() @Self() ngControl: NgControl) {
    super(ngControl);
  }

  ngOnInit(): void {
    this.labDatasource = new FlEntityPaginatedDatasource(
      (page, size, name) => this.labInstanceService.searchAll(page, size,
        this.getFilter(name)),
      20, false
    );
  }

  private getFilter(name: string): Partial<CaLabInstanceSearchFields> {
    if (this.mode === 'all') {
      return {name: name, type: 'CLOUD', isFreeLab: false};
    } else {
      return {name: name};
    }
  }

  callChangeEvent(value: CaLabInstance): void {
    this.valueChange.emit(value);
    this.selectedLab = value;
  }

  onDisableChange(): void {
  }

  writeValue(obj: CaLabInstance): void {
    if (obj == null || obj.id == null) {
      this.selectedLab = null;
      this.value = null;
      return;
    }

    // if the user is not complete
    if (obj.name == null) {
      this.selectedLab = this.labInstanceService.findById(obj.id).pipe(
        map((lab) => lab.labInstance)
      );
    } else {
      // if the user is complete
      this.selectedLab = obj;
    }
    this.value = obj;
  }

}
