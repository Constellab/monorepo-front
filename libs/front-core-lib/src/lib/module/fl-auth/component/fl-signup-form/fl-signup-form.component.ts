import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {FlSignUpUser} from '../../model/fl-sign-up-user.class';
import {Validators} from '@angular/forms';
import {FlGlobalValidators} from '../../../../utils/fl-global.validators';
import {FlCaptchaService} from '../../../fl-captcha/fl-captcha.service';
import {Subscription} from 'rxjs';

/**
 * Component that contains the form to create a new user
 */
@Component({
  selector: 'fl-signup-form',
  templateUrl: './fl-signup-form.component.html',
  styleUrls: ['./fl-signup-form.component.scss']
})
export class FlSignupFormComponent implements OnInit, OnDestroy {

  @Input() formGp: FormGroup<FlSignUpUser>;

  private subscription: Subscription;

  constructor(private captchaService: FlCaptchaService) {
  }

  public static buildFormGroup(): FormGroup<FlSignUpUser> {
    return new FormBuilder().group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, FlGlobalValidators.passwordValidator()]],
      repeatPassword: [null, [Validators.required,
        FlGlobalValidators.repeatPasswordValidator('password')]],
      category: [null, Validators.required],
      validateCGU: [false, FlGlobalValidators.isValue(true)],
      phone: [null],
      captcha: [null]
    });
  }

  ngOnInit(): void {
    this.subscription = this.captchaService.executeCaptcha('action_one')
      .subscribe((token) => this.formGp.get('captcha').setValue(token));

  }

  // update the repeat password validity on password change
  updateRepeatPasswordValidity(): void {
    this.formGp.get('repeatPassword').updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


}
