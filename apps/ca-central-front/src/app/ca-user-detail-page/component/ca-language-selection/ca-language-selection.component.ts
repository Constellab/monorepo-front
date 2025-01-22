import { Component, OnInit, inject } from '@angular/core';
import { CaAuthenticatedUserService } from '../../../ca-core/service-api/ca-authenticated-user.service';
import { MatSelectChange } from '@angular/material/select';
import { ClSupportedLanguage } from '@monorepo/core-lib';

/**
 * Component to change the app language of the current user
 */
@Component({
  selector: 'ca-language-selection',
  templateUrl: './ca-language-selection.component.html',
  styleUrls: ['./ca-language-selection.component.scss'],
  standalone: false,
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
