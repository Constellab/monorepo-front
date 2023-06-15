import {Component, Input} from '@angular/core';
import {Validators} from '@angular/forms';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {CmCredentials} from '@monorepo/common-model';

/**
 * Simple component contaning the login form
 */
@Component({
  selector: 'fl-login-form',
  templateUrl: './fl-login-form.component.html',
  styleUrls: ['./fl-login-form.component.scss'],
})
export class FlLoginFormComponent {

  @Input() formGp: FormGroup<CmCredentials>;

  public static buildForm(): FormGroup<CmCredentials> {
    return new FormBuilder().group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }
}
