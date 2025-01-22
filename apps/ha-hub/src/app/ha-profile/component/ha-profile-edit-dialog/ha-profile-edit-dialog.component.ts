import { Component, OnInit, inject } from '@angular/core';
import { FlFormDialogAbstractDirective } from '@monorepo/front-core-lib';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { HaUserService } from '../../../ha-core/ha-service/ha-user.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CoUser } from '@monorepo/community-lib';

export interface HaProfileEditDialogData {
  user: CoUser;
}

export interface HaProfileEditDialogFormData {
  id: string;
  alias: string;
  linkedinLink?: string;
  xLink?: string;
  githubLink?: string;
  interests?: string;
}

@Component({
  selector: 'ha-profile-edit-dialog',
  templateUrl: './ha-profile-edit-dialog.component.html',
  styleUrl: './ha-profile-edit-dialog.component.scss',
  standalone: false,
})
export class HaProfileEditDialogComponent
  extends FlFormDialogAbstractDirective<HaProfileEditDialogFormData, CoUser>
  implements OnInit
{
  private userService = inject(HaUserService);

  isLoading = false;
  user: CoUser;

  constructor() {
    const dialogInput = inject<HaProfileEditDialogData>(MAT_DIALOG_DATA);

    super();
    this.user = dialogInput.user;
  }

  ngOnInit(): void {
    this.formGp = this.buildForm();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      id: [this.user.id],
      alias: [
        this.user.alias,
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]*$/), Validators.maxLength(52)],
      ],
      linkedinLink: [
        this.user.linkedinLink,
        [Validators.pattern(/^https:\/\/www\.linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/)],
      ],
      xLink: [this.user.xLink, [Validators.pattern(/^https:\/\/(twitter\.com|x\.com)\/[A-Za-z0-9_]+\/?$/)]],
      githubLink: [this.user.githubLink, [Validators.pattern(/^https:\/\/github\.com\/[A-Za-z0-9-]+\/?$/)]],
      interests: [this.user.interests, [Validators.maxLength(255)]],
    });
  }

  create(): Observable<CoUser> {
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

    return (
      formValue.linkedinLink != this.user.linkedinLink ||
      formValue.xLink != this.user.xLink ||
      formValue.githubLink != this.user.githubLink ||
      formValue.interests != this.user.interests ||
      formValue.alias.trim() != this.user.alias
    );
  }

  update(formValue: HaProfileEditDialogFormData): Observable<CoUser> {
    if (this.checkModified()) {
      formValue.alias = formValue.alias.trim();
      return this.userService.editUser(formValue);
    }

    return null;
  }
}
