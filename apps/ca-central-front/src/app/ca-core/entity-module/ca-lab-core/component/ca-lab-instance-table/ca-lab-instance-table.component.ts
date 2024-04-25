import {Component, Input} from '@angular/core';
import {CaLabInstance, CaLabInstanceWithSpace} from '../../../../model/entities/lab/ca-lab-instance.class';
import {
  CaLabInstanceAdminFormDialogComponent,
  CaLabInstanceAdminFormDialogInput
} from '../ca-lab-instance-admin-form-dialog/ca-lab-instance-admin-form-dialog.component';
import {
  FlArrayObs,
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTableColumnStatic
} from '@monorepo/front-core-lib';
import {
  CaLabInstanceStatusDialogComponent
} from '../ca-lab-instance-status-dialog/ca-lab-instance-status-dialog.component';
import {CaLabInstanceService} from '../../../../service-api/ca-lab-instance.service';
import {CaRouterService} from '../../../../service/ca-router.service';
import {ClHelpService} from '@monorepo/core-lib';


@Component({
  selector: 'ca-lab-instance-table',
  templateUrl: './ca-lab-instance-table.component.html',
  styleUrls: ['./ca-lab-instance-table.component.scss']
})
export class CaLabInstanceTableComponent {

  @Input({required: true}) datasource: FlArrayObs<CaLabInstance | CaLabInstanceWithSpace>;

  @Input({required: true}) columns: FlTableColumnStatic<CaLabInstance>[];

  @Input() disableLink: boolean = false;

  constructor(private dialogService: FlDialogService,
              private labInstanceService: CaLabInstanceService) {
  }

  getLabInstanceRoute(labInstance: CaLabInstanceWithSpace): string {
    return CaRouterService.getLabInstanceDetailRoute(labInstance.id);
  }

  openUpdateDialog(labInstance: CaLabInstanceWithSpace): void {
    const dialogInput: CaLabInstanceAdminFormDialogInput = {
      mode: 'update', object: {
        id: labInstance.id,
        name: labInstance.name,
        type: labInstance.type,
        virtualHost: labInstance.virtualHost,
        serverCloud: labInstance.serverCloud,
        region: labInstance.region,
        codelabToken: labInstance.codelabToken,
        glabApiKey: labInstance.glabApiKey,
        labManagerApiKey: labInstance.labManagerApiKey,
        serverInstanceId: labInstance.serverInstanceId,
        serverVolumeId: labInstance.serverVolumeId,
        space: labInstance.space,
        billingMode: labInstance.billingMode,
        volumeType: labInstance.volumeType,
        volumeSize: labInstance.volumeSize,
        gwsCoreProdDbPassword: labInstance.gwsCoreProdDbPassword,
        gwsCoreDevDbPassword: labInstance.gwsCoreDevDbPassword,
        desktopPlatform: labInstance.desktopPlatform
      }
    };

    this.dialogService.openMediumDialog(CaLabInstanceAdminFormDialogComponent, {data: dialogInput}).afterClosed().subscribe(
      result => this.onUpdateClosed(result)
    );
  }

  private onUpdateClosed(labInstance?: CaLabInstance): void {
    if (labInstance) {
      this.datasource.updateItem(labInstance);
    }
  }

  openStatusDialog(labInstance: CaLabInstance): void {
    this.dialogService.openMediumDialog(CaLabInstanceStatusDialogComponent, {data: labInstance.id});
  }

  openDeleteDialog(labInstance: CaLabInstance): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_lab_instance',
      content: 'delete_lab_instance_confirmation',
      translateTitleAndContent: true,
      observable: this.labInstanceService.delete(labInstance.id),
      successMessage: 'lab_instance_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onDeleteClosed(result, labInstance)
    );
  }

  private onDeleteClosed(result: FlConfirmDialogResult<void>, labInstance: CaLabInstance): void {
    if (result.choice) {
      this.datasource.removeItem(labInstance);
    }
  }

  stopEventPropagation(event: Event): void {
    ClHelpService.stopEventPropagation(event);
  }
}
