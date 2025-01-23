import {
  AfterContentInit,
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Signal,
} from '@angular/core';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { FlCookieService, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { ClHelpService, ClSupportedLanguage, ClTheme } from '@monorepo/core-lib';
import { HaEnvironmentHelper } from '../../ha-core/ha-model/ha-config/ha-environment.helper';
import { isPlatformBrowser } from '@angular/common';
import { HaCookieConsentComponent } from '../ha-cookie-consent/ha-cookie-consent.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HaThemeState } from '../../ha-core/ha-state/ha-theme.state';
import { HaInstantSearchDialogComponent } from '../../ha-core/ha-component/ha-instant-search-dialog/ha-instant-search-dialog.component';
import { environment } from '../../../environments/ha-environment';
import { HaMetadataService } from '../../ha-core/ha-service/ha-metadata.service';
import { HaJsonLdState } from '../../ha-core/ha-state/ha-json-ld.state';
import { HaBigScreenMainComponent } from '../ha-big-screen-main/ha-big-screen-main.component';
import { HaSmallScreenMainComponent } from '../ha-small-screen-main/ha-small-screen-main.component';

@Component({
  selector: 'ha-main',
  templateUrl: './ha-main.component.html',
  styleUrls: ['./ha-main.component.scss'],
  providers: [HaThemeState, HaJsonLdState],
  imports: [HaBigScreenMainComponent, HaSmallScreenMainComponent],
})
export class HaMainComponent implements OnInit, AfterContentInit, OnDestroy {
  currentLanguage: ClSupportedLanguage;

  isSmallScreen = false;

  private authUserService: HaAuthenticatedUserService = inject(HaAuthenticatedUserService);
  private cookieService: FlCookieService = inject(FlCookieService);
  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  private themeState: HaThemeState = inject(HaThemeState);
  private dialogService: FlDialogService = inject(FlDialogService);
  private metadataService: HaMetadataService = inject(HaMetadataService);
  private platformId: any = inject(PLATFORM_ID);

  currentTheme: Signal<ClTheme> = this.themeState?.getCurrentTheme();

  @HostListener('window:keydown.control.k', ['$event'])
  onCtrlK(event: KeyboardEvent): void {
    ClHelpService.stopEventPropagation(event);
    if (!this.dialogService.isDialogComponentOpened(HaInstantSearchDialogComponent))
      this.dialogService.openMediumDialog(HaInstantSearchDialogComponent, {
        position: { top: '5%' },
        data: { theme: this.currentTheme() },
      });
  }

  ngOnInit(): void {
    this.themeState.init();
    this.authUserService.getUser().subscribe((user) => {
      this.currentLanguage = user != null ? user.lang : ClSupportedLanguage.en;
    });

    this.breakpointObserver.observe('(max-width: 965px)').subscribe(() => {
      this.updateIsSmallScreen();
    });

    if (environment.production && environment.settings.algoliaSiteVerificationKey) {
      this.metadataService.setAlgoliaVerificationMetaTag(environment.settings.algoliaSiteVerificationKey);
    }
  }

  private updateIsSmallScreen(): void {
    this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 965px)');
  }

  ngAfterContentInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cookieService
        .checkCookiesAcceptance({
          version: 1,
          displayMode: 'snackbar',
          component: HaCookieConsentComponent,
        })
        .subscribe((res) => {
          if (res) {
            this.setGoogleAnalytics();
          }
        });
    }
  }

  private setGoogleAnalytics(): void {
    if (document.getElementById('google-analytics-script') != null) {
      return;
    }
    const script = document.createElement('script');
    script.async = true;
    script.id = 'google-analytics-script';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${HaEnvironmentHelper.getGoogleAnalyticsId()}`;
    document.head.appendChild(script);

    const windowObj = window as any;
    windowObj['dataLayer'] = windowObj['dataLayer'] || [];
    windowObj['gtag'] = function () {
      // eslint-disable-next-line prefer-rest-params
      windowObj['dataLayer'].push(arguments);
    };
    windowObj['gtag']('js', new Date());
    windowObj['gtag']('config', HaEnvironmentHelper.getGoogleAnalyticsId());
  }

  ngOnDestroy(): void {
    this.themeState.destroy();
  }
}
