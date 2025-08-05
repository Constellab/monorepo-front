import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlConfirmDialogInput, FlDialogModule, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { HaUser } from '../../../../ha-model/ha-entities/ha-user';
import { HaRouterService } from '../../../../ha-service/ha-router.service';
import { HaCoAuthorInvite } from '../../model/ha-co-author-invite.class';
import { HaCoAuthorService } from '../../model/ha-co-author-service';

export interface HaCoAuthorsDialogInput {
  id: string;
  service: HaCoAuthorService;
  inviteText: string;
}

@Component({
  selector: 'ha-co-author-dialog',
  templateUrl: './ha-co-author-dialog.component.html',
  styleUrls: ['./ha-co-author-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    RouterLink,
    FlUserModule,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatError,
    FlLoaderModule,
    TranslatePipe,
    FlCorePipeModule,
  ],
})
export class HaCoAuthorDialogComponent implements OnInit {
  private snackBarService = inject(FlSnackBarService);
  private dialogService = inject(FlDialogService);

  profileRoute = HaRouterService.getProfileRoute();
  coAuthorPendingInvites: HaCoAuthorInvite[];
  id: string;
  formGp = new FormBuilder().group({
    coAuthorMail: [null, [Validators.required, Validators.email]],
  });
  service: HaCoAuthorService;
  coAuthors: HaUser[];
  inviteText: string;
  isLoading = false;

  constructor() {
    const dialogInput = inject<HaCoAuthorsDialogInput>(MAT_DIALOG_DATA);

    this.id = dialogInput.id;
    this.service = dialogInput.service;
    this.inviteText = dialogInput.inviteText;
  }

  ngOnInit(): void {
    this.updateCoAuthors();
    this.updateCoAuthorsInvitation();
  }

  updateCoAuthors(): void {
    this.service.getCoAuthors(this.id).subscribe((coAuthors) => {
      this.coAuthors = coAuthors;
    });
  }

  updateCoAuthorsInvitation(): void {
    this.service.getCoAuthorsPendingInvites(this.id).subscribe((coAuthorsPendingInvites) => {
      this.coAuthorPendingInvites = coAuthorsPendingInvites;
    });
  }

  openRemoveConfirmDialog(coAuthor: HaUser): void {
    const input: FlConfirmDialogInput = {
      title: 'remove_coauthor',
      content: 'remove_coauthor_dialog_content',
      successMessage: 'remove_coauthor_success',
      observable: this.service.removeCoAuthor(this.id, coAuthor.id),
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.updateCoAuthors();
        }
      });
  }

  deleteCoAuthorInvite(inviteId: string): void {
    if (inviteId != null) {
      const input: FlConfirmDialogInput = {
        title: 'cancel_invitation',
        content: 'cancel_coauthor_invitation_dialog_content',
        successMessage: 'cancel_invitation_success',
        observable: this.service.deleteCoAuthorInvite(inviteId),
      };

      this.dialogService
        .openConfirmDialog(input)
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this.updateCoAuthorsInvitation();
          }
        });
    }
  }

  checkAndSendInvite(): void {
    if (this.formGp.controls.coAuthorMail.valid) {
      const inviteMail: string = this.formGp.controls.coAuthorMail.value;
      this.isLoading = true;
      this.service.inviteCoAuthor(this.id, inviteMail).subscribe((result) => {
        if (result) {
          this.snackBarService.openSuccessMessage({
            text: 'invitation_sent_successfully',
            translateText: true,
          });
          this.updateCoAuthorsInvitation();
          this.formGp.controls.coAuthorMail.patchValue(null);
          this.isLoading = false;
        }
      });
    }
  }
}
