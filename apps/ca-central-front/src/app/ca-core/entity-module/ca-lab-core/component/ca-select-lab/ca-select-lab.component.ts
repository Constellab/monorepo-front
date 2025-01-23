import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlInputSearchFilter,
} from '@monorepo/front-core-lib/fl-core';
import { FlFormFieldDirective } from '@monorepo/front-core-lib/fl-core';
import { Observable } from 'rxjs';
import { NgControl } from '@angular/forms';
import { CaLabService } from '../../../../service-api/ca-lab.service';
import { CaLab, CaLabDatasource } from '../../../../model/entities/lab/ca-lab.class';
import { map } from 'rxjs/operators';
import { CaLabSearchFields } from '../../model/ca-lab-search.class';
import { FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { CaLabInlineComponent } from '../ca-lab-inline/ca-lab-inline.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-select-lab',
  templateUrl: './ca-select-lab.component.html',
  styleUrls: ['./ca-select-lab.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: CaSelectLabComponent }],
  imports: [FlInputSearchModule, MatIcon, MatTooltip, CaLabInlineComponent, TranslatePipe],
})
export class CaSelectLabComponent extends FlFormFieldDirective<CaLab> implements OnInit {
  private labService = inject(CaLabService);

  @Input() mode: 'all' | 'all-cloud';

  @Input() placeholder: string;

  @Output() valueChange: EventEmitter<CaLab> = new EventEmitter();

  selectedLab: CaLab | Observable<CaLab>;

  labDatasource: CaLabDatasource<FlInputSearchFilter>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  ngOnInit(): void {
    this.labDatasource = new FlEntityPaginatedDatasource(
      (page, size, data) =>
        this.labService.searchAll(page, size, this.getFilter(data.filtersCriteria.searchText)),
      20,
      { initFirstPage: false }
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

  onDisableChange(): void {}

  writeValue(obj: CaLab): void {
    if (obj == null || obj.id == null) {
      this.selectedLab = null;
      this.value = null;
      return;
    }

    // if the user is not complete
    if (obj.name == null) {
      this.selectedLab = this.labService.findById(obj.id).pipe(map((lab) => lab.lab));
    } else {
      // if the user is complete
      this.selectedLab = obj;
    }
    this.value = obj;
  }
}
