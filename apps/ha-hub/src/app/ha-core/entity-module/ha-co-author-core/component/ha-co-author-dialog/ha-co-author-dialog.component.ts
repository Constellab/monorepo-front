import {Component, Inject, OnInit} from '@angular/core';
import {FlConfirmDialogInput, FlDialogService, FlSnackBarService} from '@monorepo/front-core-lib';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HaCoAuthorService} from '../../model/ha-co-author-service';
import {HaCoAuthorInvite} from '../../model/ha-co-author-invite.class';
import {HaUser} from '../../../../ha-model/ha-entities/ha-user';
import {HaRouterService} from '../../../../ha-service/ha-router.service';

export interface HaCoAuthorsDialogInput {
  id: string;
  service: HaCoAuthorService;
  inviteText: string;
}

export interface HaCoAuthorFormData {
  id?: string;
  coAuthorMail: string;
}

@Component({
  selector: 'ha-co-author-dialog',
  templateUrl: './ha-co-author-dialog.component.html',
  styleUrls: ['./ha-co-author-dialog.component.scss']
})
export class HaCoAuthorDialogComponent implements OnInit {

  profileRoute = HaRouterService.getProfileRoute();
  coAuthorPendingInvites: HaCoAuthorInvite[];
  id: string;
  formGp: FormGroup<HaCoAuthorFormData>;
  service: HaCoAuthorService;
  coAuthors: HaUser[];
  inviteText: string;
  isLoading = false;

  constructor(private snackBarService: FlSnackBarService,
              @Inject(MAT_DIALOG_DATA) dialogInput: HaCoAuthorsDialogInput,
              private dialogService: FlDialogService) {
    this.id = dialogInput.id;
    this.service = dialogInput.service;
    this.inviteText = dialogInput.inviteText;
  }

  ngOnInit(): void {
    this.formGp = this.buildForm();

    this.updateCoAuthors();
    this.updateCoAuthorsInvitation();
  }

  updateCoAuthors(): void {
    this.service.getCoAuthors(this.id).subscribe(coAuthors => {
      this.coAuthors = coAuthors;
    });
  }

  updateCoAuthorsInvitation(): void {
    this.service.getCoAuthorsPendingInvites(this.id).subscribe(coAuthorsPendingInvites => {
      this.coAuthorPendingInvites = coAuthorsPendingInvites;
    });
  }

  buildForm(): FormGroup<HaCoAuthorFormData> {
    return new FormBuilder().group({
      coAuthorMail: [null, [Validators.required, Validators.email]]
    })
  }


  openRemoveConfirmDialog(coAuthor: HaUser): void {
    const input: FlConfirmDialogInput = {
      title: 'remove_coauthor',
      content: 'remove_coauthor_dialog_content',
      successMessage: 'remove_coauthor_success',
      observable: this.service.removeCoAuthor(this.id, coAuthor.id)
    }

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(result => {
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
        observable: this.service.deleteCoAuthorInvite(inviteId)
      }

      this.dialogService.openConfirmDialog(input).afterClosed().subscribe(result => {
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
      this.service.inviteCoAuthor(this.id, inviteMail).subscribe(result => {
        if (result) {
          this.snackBarService.openSuccessMessage({text: 'invitation_sent_successfully', translateText: true});
          this.updateCoAuthorsInvitation();
          this.formGp.controls.coAuthorMail.patchValue(null);
          this.isLoading = false;
        }
      });
    }
  }

}
