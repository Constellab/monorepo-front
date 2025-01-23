import { Component, inject } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  CaLabAdminFormDialogComponent,
  CaLabAdminFormDialogInput,
} from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-admin-form-dialog/ca-lab-admin-form-dialog.component';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { CaIsAdminDirective } from '../../../../ca-core/module/ca-core-directive/ca-is-admin/ca-is-admin.directive';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-lab-support',
  templateUrl: './ca-lab-support.component.html',
  styleUrl: './ca-lab-support.component.scss',
  imports: [FlCardModule, FlTextIconModule, MatIcon, CaIsAdminDirective, MatButton, TranslatePipe],
})
export class CaLabSupportComponent {
  private dialogService = inject(FlDialogService);
  private state = inject(CaLabDetailPageState);

  openUpdateDialog(): void {
    const dialogInput: CaLabAdminFormDialogInput = {
      mode: 'update',
      object: null,
      id: this.state.getLabId(),
    };

    this.dialogService
      .openMediumDialog(CaLabAdminFormDialogComponent, { data: dialogInput })
      .afterClosed()
      .subscribe(() => this.state.refreshLab());
  }
}
