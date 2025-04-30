import { environment } from './environments/lms-environment';
import {
  flLoadEnvironmentFromAssets,
  flLuxonDateFormat,
  flMatFormFieldConfig,
  flSetRootInjector,
  flTooltipConfig,
} from '@monorepo/front-core-lib/fl-core';
import { lmsEnvironmentPath, LmsEnvironmentSettings } from './environments/lms-environment.class';
import { importProvidersFrom, inject, Injector, provideAppInitializer } from '@angular/core';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { LmlBrickService, LmlLabManagerLibModule } from '@monorepo/lab-manager-lib';
import { LmsLabManagerBrickService } from './app/service/lms-lab-manager-brick.service';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';
import { lmsAppRoutes } from './app/lms-app.routes';
import { FlApiModule } from '@monorepo/front-core-lib/fl-api';
import { LmsApiServiceConfig } from './app/config/lms-api-module.config';
import { LmsApiErrorService } from './app/service/lms-api-error.service';
import { ClSupportedLanguage } from '@monorepo/core-lib';
import { FlIconModule, flIconsDefault } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSnackBarModule } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalActionsModule } from '@monorepo/front-core-lib/fl-portal-actions';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { LmsCoServiceConfig } from './app/config/lms-co-service.config';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LmsUserConfig } from './app/config/lms-user.config';
import { LmsAppComponent } from './app/lms-app.component';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';

function loadThemeOnInit(themeService: FlThemeService): () => void {
  return (): void => themeService.init();
}

function initRootInjector(injector: Injector): () => void {
  return (): void => flSetRootInjector(injector);
}

function bootstrapApp(): void {
  bootstrapApplication(LmsAppComponent, {
    providers: [
      importProvidersFrom(
        BrowserModule,
        FlApiModule.forRoot(LmsApiServiceConfig, LmsApiErrorService),
        // Setup translate module
        FlTranslateModule.forRoot({
          defaultLang: ClSupportedLanguage.en,
          availableLang: [ClSupportedLanguage.en, ClSupportedLanguage.fr],
          filenames: ['lms-global-'],
        }),
        FlTranslateModule.forRoot2(),
        // configuration of Front library
        FlIconModule.forRoot({
          iconFolder: 'assets/fl-mat-icons/',
          iconsToRegister: flIconsDefault,
        }),
        FlDialogModule.forRoot(),
        FlSnackBarModule.forRoot(),
        FlPortalModule.forRoot(),
        FlPortalActionsModule.forRoot(),
        CoCommunityLibModule.forRoot(LmsCoServiceConfig),
        // TODO to see, needed by community lib
        FlUserModule.forRoot(LmsUserConfig),
        LmlLabManagerLibModule
      ),
      provideAppInitializer(() => {
        const initializerFn = loadThemeOnInit(inject(FlThemeService));
        return initializerFn();
      }),
      provideAppInitializer(() => {
        const initializerFn = initRootInjector(inject(Injector));
        return initializerFn();
      }),
      // form field default config
      { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: flMatFormFieldConfig },
      // tooltip default config
      { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: flTooltipConfig },
      // configure the date picker to work with luxon
      { provide: DateAdapter, useClass: LuxonDateAdapter },
      { provide: MAT_DATE_FORMATS, useValue: flLuxonDateFormat },
      { provide: LmlBrickService, useClass: LmsLabManagerBrickService },
      provideHttpClient(withInterceptorsFromDi()),
      provideAnimations(),
      provideRouter(
        lmsAppRoutes,
        withPreloading(PreloadAllModules),
        withInMemoryScrolling({
          scrollPositionRestoration: 'enabled',
          anchorScrolling: 'enabled',
        })
      ),
    ],
  }).catch((err) => console.error(err));
}

if (environment.production) {
  flLoadEnvironmentFromAssets(lmsEnvironmentPath).then((env: LmsEnvironmentSettings) => {
    // set the environment setting from the json file
    environment.settings = env;

    bootstrapApp();
  });
} else {
  // set the environment here to simulate the production mode
  // (environment is not loaded before bootstraping the app)
  environment.settings = {
    apiUrl: 'http://localhost:3080',
    communityApiUrl: 'https://community-api-pre-prod.constellab-pre-prod.gencovery.com',
    communityFrontUrl: 'http://localhost:4200',
  };
  bootstrapApp();
}
