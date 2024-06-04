import {Component} from '@angular/core';
import {FlDialogService} from '@monorepo/front-core-lib';
import {
  CaLabInstanceAdminFormDialogComponent,
  CaLabInstanceAdminFormDialogInput
} from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-instance-admin-form-dialog/ca-lab-instance-admin-form-dialog.component';
import {CaLabInstanceDetailPageState} from '../../../state/ca-lab-instance-detail-page.state';

@Component({
  selector: 'ca-lab-support',
  templateUrl: './ca-lab-support.component.html',
  styleUrl: './ca-lab-support.component.scss'
})
export class CaLabSupportComponent {

  constructor(private dialogService: FlDialogService,
              private state: CaLabInstanceDetailPageState) {

  }

  openUpdateDialog(): void {
    const dialogInput: CaLabInstanceAdminFormDialogInput = {
      mode: 'update', object: null, id: this.state.getLabInstanceId()
    };

    this.dialogService.openMediumDialog(CaLabInstanceAdminFormDialogComponent, {data: dialogInput}).afterClosed().subscribe(
      () => this.state.refreshLabInstance()
    );
  }
}
