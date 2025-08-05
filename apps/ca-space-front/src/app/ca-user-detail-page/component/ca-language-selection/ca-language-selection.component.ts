import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { TranslatePipe } from '@ngx-translate/core';

import { CaAuthenticatedUserService } from '../../../ca-core/service-api/ca-authenticated-user.service';

/**
 * Component to change the app language of the current user
 */
@Component({
  selector: 'ca-language-selection',
  templateUrl: './ca-language-selection.component.html',
  styleUrls: ['./ca-language-selection.component.scss'],
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    ReactiveFormsModule,
    FormsModule,
    FlCoreComponentModule,
    TranslatePipe,
  ],
})
export class CaLanguageSelectionComponent implements OnInit {
  private authenticatedUserService = inject(CaAuthenticatedUserService);

  language: ClSupportedLanguage;

  isLoading: boolean = false;

  previousValue: ClSupportedLanguage;

  ngOnInit(): void {
    this.language = this.authenticatedUserService.getCurrentUser().lang;
    this.previousValue = this.language;
  }

  onLangChange(selectionChange: MatSelectChange): void {
    this.isLoading = true;
    this.authenticatedUserService.changeLanguage(selectionChange.value).subscribe(
      () => this.onLangChangeSuccess(selectionChange.value),
      () => this.onLangChangeError()
    );
  }

  private onLangChangeSuccess(lang: ClSupportedLanguage): void {
    this.previousValue = lang;
    this.isLoading = false;
  }

  private onLangChangeError(): void {
    // reset the lang
    this.language = this.previousValue;
    this.isLoading = false;
  }
}
