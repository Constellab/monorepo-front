import { Component, inject, Input } from '@angular/core';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlConfirmDialogInput, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

import { MaMailService } from '../../ma-mail.service';
import { MaMailDatasource, MaMailEntity } from '../../models/ma-mail.entity';
import { MaMailContentDialogComponent } from '../ma-mail-content-dialog/ma-mail-content-dialog.component';
import { MaMailErrorDialogComponent } from '../ma-mail-error-dialog/ma-mail-error-dialog.component';

@Component({
  selector: 'ma-mail-table',
  templateUrl: './ma-mail-table.component.html',
  styleUrl: './ma-mail-table.component.scss',
  standalone: false,
})
export class MaMailTableComponent {
  @Input({ required: true }) datasource: MaMailDatasource<any>;

  @Input() columns: FlTableColumnStatic<MaMailEntity>[] = [
    'status',
    'recipients',
    'subject',
    'lastModifiedAt',
    'actions',
  ];

  private dialogService = inject(FlDialogService);
  private mailService = inject(MaMailService);

  showMailContent(mail: MaMailEntity): void {
    this.dialogService.openMediumDialog(MaMailContentDialogComponent, { data: mail });
  }

  showError(mail: MaMailEntity): void {
    if (mail.status.value === 'ERROR') {
      this.dialogService.openSmallDialog(MaMailErrorDialogComponent, { data: mail.error });
    }
  }

  resendMail(mail: MaMailEntity): void {
    const dialogInput: FlConfirmDialogInput = {
      title: 'maMail.resendMail',
      content: 'maMail.resendMailConfirmation',
      successMessage: 'maMail.resendMailSuccess',
      observable: this.mailService.resendMail(mail.id),
    };

    this.dialogService.openConfirmDialog(dialogInput);
  }
}
