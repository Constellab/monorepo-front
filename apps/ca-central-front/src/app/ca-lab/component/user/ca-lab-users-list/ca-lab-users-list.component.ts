import { Component, Input, OnInit } from '@angular/core';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { FlDialogService, FlTableColumnStatic } from '@monorepo/front-core-lib';
import {
  CaLabUserFormDialogComponent,
  LabUserFormDialogInput,
} from '../ca-lab-user-form-dialog/ca-lab-user-form-dialog.component';
import { CaLabUser, CaLabUserDatasource } from '../../../../ca-core/model/entities/lab/ca-lab-user.class';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ca-lab-users-list',
  templateUrl: './ca-lab-users-list.component.html',
  styleUrls: ['./ca-lab-users-list.component.scss'],
})
export class CaLabUsersListComponent implements OnInit {
  @Input() labId: string;

  columns$: Observable<FlTableColumnStatic<CaLabUser>[]> = this.state.isLabOwner$().pipe(
    map((isLabOwner) => {
      const columns = ['user', 'role', 'createdBy', 'createdAt'];
      // set the action column only if the user is the lab owner
      if (isLabOwner) {
        columns.push('actions');
      }
      return columns;
    })
  );

  datasource: CaLabUserDatasource;

  isOwner$: Observable<boolean> = this.state.isLabOwner$();

  constructor(
    private labService: CaLabService,
    private dialogService: FlDialogService,
    private state: CaLabDetailPageState
  ) {}

  ngOnInit(): void {
    this.datasource = new CaLabUserDatasource(this.labService.getLabUsers(this.labId));
  }

  openAddUserDialog(): void {
    const input: LabUserFormDialogInput = {
      labId: this.labId,
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(CaLabUserFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((result) => this.onUserAddedClosed(result));
  }

  private onUserAddedClosed(labUser?: CaLabUser): void {
    if (labUser) {
      this.datasource.addItem(labUser);
    }
  }
}
