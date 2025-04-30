import { Component, inject, OnInit } from '@angular/core';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { FlArrayObs, FlEntityArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { CaLabGreenOption } from '../../../../ca-core/model/entities/lab/ca-lab-green-option.class';
import {
  CaLabGreenOptionFormDialogComponent,
  CaLabGreenOptionFormDialogInput,
} from '../ca-lab-green-option-form-dialog/ca-lab-green-option-form-dialog.component';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { CaLabGreenOptionTableComponent } from '../ca-lab-green-option-table/ca-lab-green-option-table.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-lab-green-options',
  templateUrl: './ca-lab-green-options.component.html',
  styleUrls: ['./ca-lab-green-options.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    FlSectionModule,
    CaLabGreenOptionTableComponent,
    TranslatePipe,
  ],
})
export class CaLabGreenOptionsComponent implements OnInit {
  private labService = inject(CaLabService);
  private state = inject(CaLabDetailPageState);
  private dialogService = inject(FlDialogService);

  labGreenOptions$: FlArrayObs<CaLabGreenOption>;

  columns: FlTableColumnStatic<CaLabGreenOption>[] = ['type', 'isPersistent', 'value', 'created', 'actions'];

  ngOnInit(): void {
    this.labGreenOptions$ = new FlEntityArrayObs(this.labService.getGreenOptions(this.state.getLabId()));
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
      this.labGreenOptions$.addItem(greenOption);
    }
  }
}
