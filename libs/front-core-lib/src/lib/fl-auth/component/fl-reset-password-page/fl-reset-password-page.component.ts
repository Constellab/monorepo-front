import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { FlUserAccountService } from '../../service/fl-user-account.service';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlGlobalValidators } from '@monorepo/front-core-lib/fl-core';

@Component({
  selector: 'fl-reset-password-page',
  templateUrl: './fl-reset-password-page.component.html',
  styleUrls: ['./fl-reset-password-page.component.scss'],
  standalone: false,
})
export class FlResetPasswordPageComponent {
  private route = inject(ActivatedRoute);
  private userAccountService = inject(FlUserAccountService);
  private snackBarService = inject(FlSnackBarService);
  private router = inject(Router);

  formGp = new FormBuilder().group({
    password: [null, [Validators.required, FlGlobalValidators.passwordValidator()]],
    repeatPassword: [null, [Validators.required, FlGlobalValidators.repeatPasswordValidator('password')]],
  });

  isLoading: boolean = false;

  submit(): void {
    if (this.formGp.valid && !this.isLoading) {
      this.isLoading = true;
      const password: string = this.formGp.value.password;

      // get the token from URL and call reset password
      this.route.params.pipe(first()).subscribe((params) => this.resetPassword(password, params.token));
    }
  }

  private resetPassword(password: string, token: string): void {
    this.userAccountService.resetPassword(password, token).subscribe({
      next: () => this.resetSuccess(),
      error: () => (this.isLoading = false),
    });
  }

  private resetSuccess(): void {
    this.snackBarService.openSuccessMessage({ text: 'flAuth.password_changed', translateText: true });

    this.isLoading = false;
    this.router.navigate(['/']);
  }
}
