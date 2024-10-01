import { Component, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';
import {
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlFormFieldDirective,
  FlInputSearchFilter
} from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { NgControl } from '@angular/forms';
import { CaLabService } from '../../../../service-api/ca-lab.service';
import { CaLab, CaLabDatasource } from '../../../../model/entities/lab/ca-lab.class';
import { map } from 'rxjs/operators';
import { CaLabSearchFields } from '../../model/ca-lab-search.class';

@Component({
  selector: 'ca-select-lab',
  templateUrl: './ca-select-lab.component.html',
  styleUrls: ['./ca-select-lab.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: CaSelectLabComponent }]
})
export class CaSelectLabComponent extends FlFormFieldDirective<CaLab> implements OnInit {

  @Input() mode: 'all' | 'all-cloud';

  @Input() placeholder: string;

  @Output() valueChange: EventEmitter<CaLab> = new EventEmitter();

  selectedLab: CaLab | Observable<CaLab>;

  labDatasource: CaLabDatasource<FlInputSearchFilter>;

  constructor(private labService: CaLabService,
              @Optional() @Self() ngControl: NgControl) {
    super(ngControl);
  }

  ngOnInit(): void {
    this.labDatasource = new FlEntityPaginatedDatasource(
      (page, size, data) => this.labService.searchAll(page, size,
        this.getFilter(data.filtersCriteria.searchText)),
      20, false
    );
  }

  private getFilter(name: string): FlDatasourceGetPageData<CaLabSearchFields> {
    if (this.mode === 'all') {
      return { filtersCriteria: { name: name, type: 'CLOUD', isFreeLab: false }, sortsCriteria: [] };
    } else {
      return { filtersCriteria: { name: name }, sortsCriteria: [] };
    }
  }

  callChangeEvent(value: CaLab): void {
    this.valueChange.emit(value);
    this.selectedLab = value;
  }

  onDisableChange(): void {
  }

  writeValue(obj: CaLab): void {
    if (obj == null || obj.id == null) {
      this.selectedLab = null;
      this.value = null;
      return;
    }

    // if the user is not complete
    if (obj.name == null) {
      this.selectedLab = this.labService.findById(obj.id).pipe(
        map((lab) => lab.lab)
      );
    } else {
      // if the user is complete
      this.selectedLab = obj;
    }
    this.value = obj;
  }

}
