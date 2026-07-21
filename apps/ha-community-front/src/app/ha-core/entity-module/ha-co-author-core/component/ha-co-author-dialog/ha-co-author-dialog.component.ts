import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlConfirmDialogInput, FlDialogModule, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';
import { startWith } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import {
  HaUser,
  HaUserSearchDatasourcePaginated,
  HaUserSearchFilter,
} from '../../../../ha-model/ha-entities/ha-user';
import { HaRouterService } from '../../../../ha-service/ha-router.service';
import { HaUserService } from '../../../../ha-service/ha-user.service';
import { HaCoAuthorInvite } from '../../model/ha-co-author-invite.class';
import { HaCoAuthorService } from '../../model/ha-co-author-service';

export interface HaCoAuthorsDialogInput {
  id: string;
  service: HaCoAuthorService;
  inviteText: string;
  authorId: string;
}

@Component({
  selector: 'ha-co-author-dialog',
  templateUrl: './ha-co-author-dialog.component.html',
  styleUrls: ['./ha-co-author-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
    FlLoaderModule,
    TranslatePipe,
    FlCorePipeModule,
    MatAutocomplete,
    AsyncPipe,
    MatOption,
    MatAutocompleteTrigger,
  ],
})
export class HaCoAuthorDialogComponent implements OnInit {
  private snackBarService = inject(FlSnackBarService);
  private dialogService = inject(FlDialogService);
  private userService = inject(HaUserService);

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

  inputCtrl = new UntypedFormControl();
  isInputValueEmail = false;
  filteredOptions: HaUserSearchDatasourcePaginated;
  searchDebounceTime: number = 300;
  authorId: string;

  constructor() {
    const dialogInput = inject<HaCoAuthorsDialogInput>(MAT_DIALOG_DATA);

    this.id = dialogInput.id;
    this.service = dialogInput.service;
    this.inviteText = dialogInput.inviteText;
    this.authorId = dialogInput.authorId;
  }

  ngOnInit(): void {
    this.filteredOptions = new HaUserSearchDatasourcePaginated(
      (page, size, filters) => this.userService.searchUser(filters.filtersCriteria, page, size),
      10,
      { initFirstPage: false }
    );
    this.updateCoAuthors();
    this.updateCoAuthorsInvitation();

    this.inputCtrl.valueChanges
      .pipe(startWith(''))
      .pipe(debounceTime(this.searchDebounceTime))
      .subscribe((inputText) => {
        this.isInputValueEmail = ClStringHelper.isEmail(inputText);
        if (inputText?.length >= 2) {
          this.loadPage(inputText);
        } else {
          this.filteredOptions.clear();
        }
      });
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

  optionSelected(event: MatAutocompleteSelectedEvent): void {
    this.sendInvite(event.option.value);
  }

  checkIfCoAuthor(user: HaUser): boolean {
    return (
      this.coAuthors.some((coAuthor) => coAuthor.id == user.id) ||
      this.coAuthorPendingInvites.some((invite) => invite.email == user.email || invite.user.id == user.id)
    );
  }

  private sendInvite(emailOrId: string): void {
    this.isLoading = true;
    this.service.inviteCoAuthor(this.id, emailOrId).subscribe((result) => {
      if (result) {
        this.snackBarService.openSuccessMessage({
          text: 'invitation_sent_successfully',
          translateText: true,
        });
        this.updateCoAuthorsInvitation();
        this.inputCtrl.patchValue('');
        this.isLoading = false;
      }
    });
  }

  private loadPage(inputText: string): void {
    const filters: HaUserSearchFilter = {
      alias: inputText,
      email: ClStringHelper.isEmail(inputText) ? inputText : '',
    };

    this.filteredOptions.getFirstPage(filters);
  }
}
