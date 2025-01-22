import { Component, OnInit, inject } from '@angular/core';
import {
  FlCaptchaService,
  FlSignupFormComponent,
  FlSignUpUser,
  FlSnackBarService,
} from '@monorepo/front-core-lib';
import { CaSpaceInvitService } from '../../../ca-core/service-api/ca-space-invit.service';
import { ActivatedRoute } from '@angular/router';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import { CaSpaceInvitReadDTO } from '../../../ca-core/model/entities/space/ca-space-invit.class';
import { Observable, switchMap, tap } from 'rxjs';
import { CaUserAccountsService } from '../../../ca-core/service-api/ca-user-accounts.service';
import { CaAuthService } from '../../service/ca-auth.service';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { FlSectionModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { FlCardModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlAuthModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-auth/fl-auth.module';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { TranslatePipe } from '@ngx-translate/core';
import { CaSpacePhotoPipe } from '../../../ca-core/entity-module/ca-space-core/pipe/ca-space-photo.pipe';

/**
 * Page on which the user can join an space. He can create an account or use an existing one.
 */
@Component({
  selector: 'ca-signup-to-space-page',
  templateUrl: './ca-signup-to-space-page.component.html',
  styleUrls: ['./ca-signup-to-space-page.component.scss'],
  imports: [
    FlSectionModule,
    FlCardModule,
    ReactiveFormsModule,
    FlAuthModule,
    MatButton,
    FlLoaderModule,
    TranslatePipe,
    CaSpacePhotoPipe,
  ],
})
export class CaSignupToSpacePageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private spaceInvitService = inject(CaSpaceInvitService);
  private snackBarService = inject(FlSnackBarService);
  private routerService = inject(CaRouterService);
  private userAccountService = inject(CaUserAccountsService);
  private authService = inject(CaAuthService);
  private captchaService = inject(FlCaptchaService);

  invitation$: Observable<CaSpaceInvitReadDTO>;

  invitationCode: string;

  signupFormGp: UntypedFormGroup;

  isLoading: boolean = false;

  ngOnInit(): void {
    this.route.params.subscribe((params) => this.getInvitation(params.code));
  }

  private getInvitation(code: string): void {
    this.invitationCode = code;
    this.invitation$ = this.spaceInvitService
      .getInvitationByCode(code)
      .pipe(tap((invitation) => this.getInvitationSuccess(invitation)));
  }

  private getInvitationSuccess(invitation: CaSpaceInvitReadDTO): void {
    this.signupFormGp = FlSignupFormComponent.buildFormGroup();
    this.signupFormGp.get('email').setValue(invitation.invitation.userMail);
    this.signupFormGp.get('email').disable();
  }

  signupSubmit(): void {
    if (this.signupFormGp.valid && !this.isLoading) {
      this.signup(this.signupFormGp.getRawValue());
    } else {
      this.signupFormGp.markAllAsTouched();
    }
  }

  private signup(user: FlSignUpUser): void {
    this.isLoading = true;

    this.generateCaptcha()
      .pipe(
        switchMap((token) => {
          user.captcha = token;
          return this.userAccountService.createUserAndJoinSpace(this.invitationCode, user);
        })
      )
      .subscribe({
        next: () => this.signupSuccess(),
        error: () => (this.isLoading = false),
      });
  }

  private generateCaptcha(): Observable<string> {
    return this.captchaService.executeCaptcha('action_two');
  }

  private signupSuccess(): void {
    this.snackBarService.openSuccessMessage(
      { text: 'join_space_new_user_success', translateText: true },
      7000
    );
    this.routerService.navigatorToLoginRoute();
    this.isLoading = false;
  }

  acceptInvitation(): void {
    this.isLoading = true;
    this.spaceInvitService.acceptInvitationExistingUser(this.invitationCode).subscribe({
      next: () => this.acceptInvitationSuccess(),
      error: () => (this.isLoading = false),
    });
  }

  private acceptInvitationSuccess(): void {
    this.isLoading = false;
    this.snackBarService.openSuccessMessage({
      text: 'join_space_existing_user_success',
      translateText: true,
    });

    if (this.authService.hasAuthorizationCookie()) {
      this.routerService.navigateToDashboard();
    } else {
      this.routerService.navigatorToLoginRoute();
    }
  }
}
