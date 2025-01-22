import { Component, OnInit, inject } from '@angular/core';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { FlArrayObs, FlDialogService, FlEntityArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { CaLabGreenOption } from '../../../../ca-core/model/entities/lab/ca-lab-green-option.class';
import {
  CaLabGreenOptionFormDialogComponent,
  CaLabGreenOptionFormDialogInput,
} from '../ca-lab-green-option-form-dialog/ca-lab-green-option-form-dialog.component';

@Component({
  selector: 'ca-lab-green-options',
  templateUrl: './ca-lab-green-options.component.html',
  styleUrls: ['./ca-lab-green-options.component.scss'],
  standalone: false,
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
