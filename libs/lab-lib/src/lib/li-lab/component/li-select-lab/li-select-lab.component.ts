import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import {
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlFormFieldDirective,
  FlInputSearchFilter,
} from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInputSearchAdvancedButton, FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTranslatableText, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { LiLab, LiLabDatasource } from '@monorepo/lab-lib/li-core';
import { Observable } from 'rxjs';

import { LiLabService } from '../../service/li-lab.service';
import { LiLabSearchFields } from '../../service/li-lab-search.class';
import { LiLabInlineComponent } from '../li-lab-inline/li-lab-inline.component';
import { LiSelectLabDialogComponent } from '../li-select-lab-dialog/li-select-lab-dialog.component';

@Component({
  selector: 'li-select-lab',
  templateUrl: './li-select-lab.component.html',
  styleUrls: ['./li-select-lab.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LiSelectLabComponent }],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlInputSearchModule, MatIcon, LiLabInlineComponent, AsyncPipe, FlTranslateModule, FlIconModule],
})
export class LiSelectLabComponent extends FlFormFieldDirective<LiLab | null> implements OnInit {
  private labService = inject(LiLabService);
  private dialogService = inject(FlDialogService);

  @Input() placeholder: FlTranslatableText = { text: 'li.select_lab', translateText: true };

  @Output() labChange: EventEmitter<LiLab | null> = new EventEmitter();

  selectedLab: LiLab | Observable<LiLab> | null;

  datasource: LiLabDatasource<FlInputSearchFilter>;

  advancedButton: FlInputSearchAdvancedButton<LiLab>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, data) => {
        const searchFields: FlDatasourceGetPageData<LiLabSearchFields> = {
          filtersCriteria: {
            name: data.filtersCriteria.searchText,
          },
          sortsCriteria: [{ key: 'name', direction: 'ASC' }],
        };
        return this.labService.search(page, size, searchFields);
      },
      20,
      { initFirstPage: false }
    );

    this.advancedButton = {
      onClick: () => this.dialogService.openBigDialog(LiSelectLabDialogComponent).afterClosed(),
    };
  }

  writeValue(obj: LiLab | null): void {
    if (obj == null || (typeof obj != 'string' && obj.name == null)) {
      this.selectedLab = null;
      this.value = null;
      return;
    }

    if (typeof obj == 'string') {
      this.selectedLab = this.labService.findById(obj);
    } else if (!(obj instanceof LiLab)) {
      this.selectedLab = this.labService.findById((obj as any).id);
    } else {
      this.selectedLab = obj;
    }
    this.value = obj;
  }

  callChangeEvent(value: LiLab | null): void {
    this.labChange.next(value);
    this.selectedLab = value;
  }

  onDisableChange(): void {}
}
