import { Component, computed, input, OnInit, Signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HaConstellabHelper } from '../../ha-model/ha-config/ha-constellab.helper';
import { ClStringHelper } from '@monorepo/core-lib';
import { MatAnchor } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';

@Component({
  selector: 'ha-email-sign-up',
  standalone: true,
  imports: [MatAnchor, ReactiveFormsModule, FlTranslateModule, NgClass],
  templateUrl: './ha-email-sign-up.component.html',
  styleUrl: './ha-email-sign-up.component.scss',
})
export class HaEmailSignUpComponent implements OnInit {
  border = input<boolean>();
  light = input<boolean>();

  classesString: Signal<string> = computed(() => {
    const borderClass = this.border() ? 'sign-up-div-border' : '';
    const lightClass = this.light() ? 'sign-up-div-light' : '';

    return borderClass + ' ' + lightClass;
  });

  signupLink: string = HaConstellabHelper.getConstellabSignupUrl();
  emailFormControl = new FormControl('');

  ngOnInit(): void {
    this.emailFormControl.valueChanges.subscribe((value) => {
      this.updateSignUpMail(value);
    });
  }

  private updateSignUpMail(value: string): void {
    if (ClStringHelper.isEmail(value)) {
      this.signupLink = HaConstellabHelper.getConstellabSignupUrl() + '?email=' + value;
    } else {
      this.signupLink = HaConstellabHelper.getConstellabSignupUrl();
    }
  }
}
