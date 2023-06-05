import {Component, OnInit} from '@angular/core';
import {CaLabInstanceService} from '../../../../ca-core/service-api/ca-lab-instance.service';
import {CaLabInstanceDetailPageState} from '../../../state/ca-lab-instance-detail-page.state';
import {FlArrayObs, FlDialogService, FlEntityArrayObs, FlTableColumnStatic} from '@monorepo/front-core-lib';
import {CaLabGreenOption} from '../../../../ca-core/model/entities/lab/ca-lab-green-option.class';
import {
  CaLabGreenOptionFormDialogComponent,
  CaLabGreenOptionFormDialogInput
} from '../ca-lab-green-option-form-dialog/ca-lab-green-option-form-dialog.component';

@Component({
  selector: 'ca-lab-green-options',
  templateUrl: './ca-lab-green-options.component.html',
  styleUrls: ['./ca-lab-green-options.component.scss'],
})
export class CaLabGreenOptionsComponent implements OnInit {

  labGreenOptions$: FlArrayObs<CaLabGreenOption>;

  columns: FlTableColumnStatic<CaLabGreenOption>[] = ['type', 'isPersistent', 'value', 'created', 'actions'];


  constructor(private labInstanceService: CaLabInstanceService,
              private state: CaLabInstanceDetailPageState,
              private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    this.labGreenOptions$ = new FlEntityArrayObs(this.labInstanceService.getGreenOptions(this.state.getLabInstanceId()));
  }

  openCreateGreenOptionDialog(): void {
    const data: CaLabGreenOptionFormDialogInput = {
      mode: 'create',
      labInstanceId: this.state.getLabInstanceId()
    };

    this.dialogService.openSmallDialog(CaLabGreenOptionFormDialogComponent, {data: data}).afterClosed().subscribe(
      (greenOption: CaLabGreenOption) => this.onCreateGreenOptionClosed(greenOption)
    );
  }

  private onCreateGreenOptionClosed(greenOption?: CaLabGreenOption): void {
    if (greenOption) {
      this.labGreenOptions$.addItem(greenOption);
    }

  }

}
