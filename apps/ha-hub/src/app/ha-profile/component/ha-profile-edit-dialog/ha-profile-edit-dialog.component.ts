import {Component, Inject, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective} from '@monorepo/front-core-lib';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Observable} from 'rxjs';
import {HaUserService} from '../../../ha-core/ha-service/ha-user.service';
import {Validators} from '@angular/forms';
import {CoUser} from '@monorepo/community-lib';

export interface HaProfileEditDialogData {
  user: CoUser;
}

export interface HaProfileEditDialogFormData {
  id: string;
  linkedinLink?: string;
  xLink?: string;
  githubLink?: string;
  interests?: string;
}

@Component({
  selector: 'ha-profile-edit-dialog',
  templateUrl: './ha-profile-edit-dialog.component.html',
  styleUrl: './ha-profile-edit-dialog.component.scss'
})
export class HaProfileEditDialogComponent extends FlFormDialogAbstractDirective<HaProfileEditDialogFormData, CoUser>
  implements OnInit {

  isLoading = false;
  user: CoUser;

  constructor(@Inject(MAT_DIALOG_DATA) dialogInput: HaProfileEditDialogData,
              private userService: HaUserService) {
    super();
    this.user = dialogInput.user
  }

  ngOnInit(): void {
    this.formGp = this.buildForm();
  }

  buildForm(): FormGroup<HaProfileEditDialogFormData> {
    return new FormBuilder().group({
      id: [this.user.id],
      linkedinLink: [this.user.linkedinLink, [Validators.pattern(/^https:\/\/www\.linkedin\.com\/.*$/)]],
      xLink: [this.user.xLink, [Validators.pattern(/^https:\/\/(twitter\.com|x\.com)\/.*$/)]],
      githubLink: [this.user.githubLink, [Validators.pattern(/^https:\/\/github\.com\/.*$/)]],
      interests: [this.user.interests, [Validators.maxLength(255)]]
    });
  }

  create(formValue: HaProfileEditDialogFormData): Observable<CoUser> {
    return undefined;
  }

  getCreateSuccessMessage(): string {
    return '';
  }

  getUpdateSuccessMessage(): string {
    return 'user_infos_updated_successfully';
  }

  checkModified(): boolean {
    const formValue = this.formGp.value;

    return formValue.linkedinLink != this.user.linkedinLink ||
      formValue.xLink != this.user.xLink ||
      formValue.githubLink != this.user.githubLink ||
      formValue.interests != this.user.interests
  }

  update(formValue: HaProfileEditDialogFormData): Observable<CoUser> {
    if (this.checkModified())
      return this.userService.editUser(formValue);

    return null;
  }
}
