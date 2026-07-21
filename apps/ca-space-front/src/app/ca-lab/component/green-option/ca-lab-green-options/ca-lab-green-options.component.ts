import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { TranslatePipe } from '@ngx-translate/core';

import { CaLabGreenOption } from '../../../../ca-core/model/entities/lab/ca-lab-green-option.class';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { CaLabGreenOptionsState } from '../../../state/ca-lab-green-options.state';
import {
  CaLabGreenOptionFormDialogComponent,
  CaLabGreenOptionFormDialogInput,
} from '../ca-lab-green-option-form-dialog/ca-lab-green-option-form-dialog.component';
import { CaLabGreenOptionTableComponent } from '../ca-lab-green-option-table/ca-lab-green-option-table.component';

@Component({
  selector: 'ca-lab-green-options',
  templateUrl: './ca-lab-green-options.component.html',
  styleUrls: ['./ca-lab-green-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIcon, MatButton, MatTooltip, FlSectionModule, CaLabGreenOptionTableComponent, TranslatePipe],
})
export class CaLabGreenOptionsComponent implements OnInit {
  private state = inject(CaLabDetailPageState);
  private dialogService = inject(FlDialogService);
  private greenOptionsState = inject(CaLabGreenOptionsState);

  // read in ngOnInit, not as a field initializer: the parent dashboard calls greenOptionsState.init()
  // in its own ngOnInit, so the datasource only exists once this component is initialized.
  labGreenOptions$: FlArrayObs<CaLabGreenOption>;

  columns: FlTableColumnStatic<CaLabGreenOption>[] = ['type', 'isPersistent', 'value', 'created', 'actions'];

  ngOnInit(): void {
    this.labGreenOptions$ = this.greenOptionsState.getDatasource();
  }

  openCreateGreenOptionDialog(): void {
    const data: CaLabGreenOptionFormDialogInput = {
      mode: 'create',
      labId: this.state.getLabId(),
    };

    this.dialogService
      .openSmallDialog(CaLabGreenOptionFormDialogComponent, { data: data, autoFocus: false })
      .afterClosed()
      .subscribe((greenOption: CaLabGreenOption) => this.onCreateGreenOptionClosed(greenOption));
  }

  private onCreateGreenOptionClosed(greenOption?: CaLabGreenOption): void {
    if (greenOption) {
      this.greenOptionsState.addItem(greenOption);
    }
  }
}
