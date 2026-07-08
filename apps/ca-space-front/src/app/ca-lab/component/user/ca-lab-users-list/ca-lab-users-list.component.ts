import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CaLabUser, CaLabUserDatasource } from '../../../../ca-core/model/entities/lab/ca-lab-user.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import {
  CaLabUserFormDialogComponent,
  CaLabUserFormDialogInput,
} from '../ca-lab-user-form-dialog/ca-lab-user-form-dialog.component';
import { CaLabUsersTableComponent } from '../ca-lab-users-table/ca-lab-users-table.component';

@Component({
  selector: 'ca-lab-users-list',
  templateUrl: './ca-lab-users-list.component.html',
  styleUrls: ['./ca-lab-users-list.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    FlSectionModule,
    CaLabUsersTableComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaLabUsersListComponent implements OnInit {
  private labService = inject(CaLabService);
  private dialogService = inject(FlDialogService);
  private state = inject(CaLabDetailPageState);

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

  ngOnInit(): void {
    this.datasource = new CaLabUserDatasource(this.labService.getLabUsers(this.labId));
  }

  openAddUserDialog(): void {
    const input: CaLabUserFormDialogInput = {
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
