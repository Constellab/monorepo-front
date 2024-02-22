import {Component, Inject, OnInit} from '@angular/core';
import {
  FlConfirmDialogInput,
  FlDialogService,
  FlFormDialogAbstractDirective,
  FlFormDialogInput,
  FlSnackBarService
} from '@monorepo/front-core-lib';
import {HaStory} from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import {HaStoryService} from '../../../ha-core/ha-service/ha-story.service';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HaStoryAuthorInvite} from '../../../ha-core/ha-model/ha-entities/ha-story-author-invite.class';
import {HaUser} from '../../../ha-core/ha-model/ha-entities/ha-user';

export type HaCreateStoryDtoInput = FlFormDialogInput<HaCoAuthorFormData>;

export interface HaCoAuthorFormData {
  id?: string;
  coAuthorMail: string;
}

export interface HaCoAuthorEmail {
  id?: string;
  fullName?: string;
  email: string;
}

@Component({
  selector: 'ha-story-co-author-dialog',
  templateUrl: './ha-story-co-author-dialog.component.html',
  styleUrls: ['./ha-story-co-author-dialog.component.scss']
})
export class HaStoryCoAuthorDialogComponent extends FlFormDialogAbstractDirective<HaCoAuthorFormData, HaStory> implements OnInit {

  coAuthorPendingInvites: HaStoryAuthorInvite[];
  storyId: string;
  storyCoAuthors: HaUser[];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  constructor(snackBarService: FlSnackBarService,
              dialogRef: MatDialogRef<HaStoryCoAuthorDialogComponent>,
              @Inject(MAT_DIALOG_DATA) dialogInput: HaCreateStoryDtoInput,
              private dialogService: FlDialogService,
              private storyService: HaStoryService) {
    super(dialogInput, snackBarService, dialogRef);
    this.storyId = dialogInput.object.id;
  }

  ngOnInit(): void {
    this.formGp = this.buildForm();

    this.updateCoAuthors();
    this.updateCoAuthorsInvitation();
  }

  updateCoAuthors(): void {
    this.storyService.getStoryCoAuthors(this.storyId).subscribe(storyCoAuthors => {
      this.storyCoAuthors = storyCoAuthors;
    });
  }

  updateCoAuthorsInvitation(): void {
    this.storyService.getStoryCoAuthorsPendingInvites(this.storyId).subscribe(storyCoAuthorsPendingInvites => {
      this.coAuthorPendingInvites = storyCoAuthorsPendingInvites;
    });
  }

  buildForm(): FormGroup<HaCoAuthorFormData> {
    return new FormBuilder().group({
      coAuthorMail: [null, [Validators.required, Validators.email]]
    })
  }


  openRemoveConfirmDialog(storyCoAuthor: HaUser): void {
    const input: FlConfirmDialogInput = {
      title: 'remove_coauthor',
      content: 'remove_coauthor_dialog_content',
      translateTitleAndContent: true,
      successMessage: 'remove_coauthor_success',
      translateMessage: true,
      observable: this.storyService.removeStoryCoAuthor(this.storyId, storyCoAuthor.id)
    }

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(result => {
      if (result) {
        this.updateCoAuthors();
      }
    });
  }

  deleteCoAuthorInvite(inviteId: string): void{
    if(inviteId != null){
      const input: FlConfirmDialogInput = {
        title: 'cancel_invitation',
        content: 'cancel_story_coauthor_invitation_dialog_content',
        translateTitleAndContent: true,
        successMessage: 'cancel_invitation_success',
        translateMessage: true,
        observable: this.storyService.deleteCoAuthorInvite(inviteId)
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
      this.storyService.inviteStoryCoAuthor(this.storyId, inviteMail).subscribe(result => {
        if (result) {
          this.snackBarService.openSuccessMessage({text: 'invitation_sent_successfully', translateText: true});
          this.updateCoAuthorsInvitation();
          this.formGp.controls.coAuthorMail.patchValue(null);
        }
      });
    }
  }

  create(formValue: HaCoAuthorFormData): Observable<HaStory> {
    throw new Error('Method not implemented.');
  }

  update(formValue: HaCoAuthorFormData): Observable<HaStory> {
    throw new Error('Method not implemented.');
  }

  getCreateSuccessMessage(): string {
    throw new Error('Method not implemented.');
  }

  getUpdateSuccessMessage(): string {
    return 'coauthors_updated_successfully';
  }

}
