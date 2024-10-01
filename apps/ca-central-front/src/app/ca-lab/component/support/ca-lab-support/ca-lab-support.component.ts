import {Component} from '@angular/core';
import {FlDialogService} from '@monorepo/front-core-lib';
import {
  CaLabAdminFormDialogComponent,
  CaLabAdminFormDialogInput
} from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-admin-form-dialog/ca-lab-admin-form-dialog.component';
import {CaLabDetailPageState} from '../../../state/ca-lab-detail-page.state';

@Component({
  selector: 'ca-lab-support',
  templateUrl: './ca-lab-support.component.html',
  styleUrl: './ca-lab-support.component.scss'
})
export class CaLabSupportComponent {

  constructor(private dialogService: FlDialogService,
              private state: CaLabDetailPageState) {

  }

  openUpdateDialog(): void {
    const dialogInput: CaLabAdminFormDialogInput = {
      mode: 'update', object: null, id: this.state.getLabId()
    };

    this.dialogService.openMediumDialog(CaLabAdminFormDialogComponent, {data: dialogInput}).afterClosed().subscribe(
      () => this.state.refreshLab()
    );
  }
}
