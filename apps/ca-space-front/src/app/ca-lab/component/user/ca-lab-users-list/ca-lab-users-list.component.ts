import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CaLabUser, CaLabUserDatasource } from '../../../../ca-core/model/entities/lab/ca-lab-user.class';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { CaLabUsersState } from '../../../state/ca-lab-users.state';
import {
  CaLabUserFormDialogComponent,
  CaLabUserFormDialogInput,
} from '../ca-lab-user-form-dialog/ca-lab-user-form-dialog.component';
import { CaLabUsersTableComponent } from '../ca-lab-users-table/ca-lab-users-table.component';

@Component({
  selector: 'ca-lab-users-list',
  templateUrl: './ca-lab-users-list.component.html',
  styleUrls: ['./ca-lab-users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatIcon,
    MatButton,
    MatTooltip,
    FlSectionModule,
    CaLabUsersTableComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaLabUsersListComponent implements OnInit {
  private dialogService = inject(FlDialogService);
  private state = inject(CaLabDetailPageState);
  private usersState = inject(CaLabUsersState);

  @Input() labId: string;

  // read in ngOnInit, not as a field initializer: the parent dashboard calls usersState.init()
  // in its own ngOnInit, so the datasource only exists once this component is initialized.
  datasource: CaLabUserDatasource;

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

  isOwner$: Observable<boolean> = this.state.isLabOwner$();

  ngOnInit(): void {
    this.datasource = this.usersState.getDatasource();
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
      this.usersState.addItem(labUser);
    }
  }
}
