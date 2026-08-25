import { inject, Injectable, Injector, REQUEST } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { ClDateHelper, clLangIsSupported, ClStringHelper, ClSupportedLanguage } from '@monorepo/core-lib';
import { FlPlatformService } from '@monorepo/front-core-lib/fl-core';
import { TranslateService } from '@ngx-translate/core';
import { Settings } from 'luxon';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { FL_TRANSLATE_MODULE_CONFIG, FlTranslateModuleConfig } from '../model/fl-translate-module-config';
import {
  FlTranslatableText,
  FlTranslateMode,
  FlTranslateObject,
  FlTranslateParam,
} from '../model/fl-translate-param';

@Injectable()
export class FlTranslateService {
  private translateService = inject(TranslateService);
  private platformService = inject(FlPlatformService);
  private cookieService = inject(CookieService);
  private config = inject<FlTranslateModuleConfig>(FL_TRANSLATE_MODULE_CONFIG);
  private adapter = inject<DateAdapter<any>>(DateAdapter);
  private injector = inject(Injector);

  private static instance: FlTranslateService | null = null;

  // key to store the user language in the cookie
  private readonly cookieKey = 'lang';

  // store the module that have been translated
  private modulesTranslation: string[] = [];

  private request: any;

  constructor() {
    // save this instance to static attribute
    FlTranslateService.instance = this;

    this.request = this.injector.get(REQUEST);
  }

  /**
   * @return the current instance of the translate service
   */
  public static getInstance(): FlTranslateService | null {
    return FlTranslateService.instance;
  }

  /**
   * @ignore
   * Init the default language and the used language
   *
   * Should not be call outside the library
   */
  public init(): void {
    const defaultLang = this.getDefaultLanguage();
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translateService.setFallbackLang(defaultLang);

    // set the app language
    const userLang = this.getUserLanguage();
    this.setAppLanguage(userLang);
  }

  /**
   * Returns the translation based on a key
   * @param key translation key
   * @param params optional params for the translation
   */
  public translate(key: string, params: FlTranslateParam = {}): string {
    const text = this.translateService.instant(key, params.param);

    return this.convertTranslatedTextCase(text, params.mode);
  }

  /**
   * Translate or not a text
   * @param translatableText
   */
  public translatableText(translatableText: FlTranslatableText): string | null {
    if (translatableText == null) return null;
    if (typeof translatableText === 'string') {
      return this.translate(translatableText);
    } else if (translatableText.translateText === false) {
      return translatableText.text;
    } else {
      return this.translate(translatableText.text, translatableText.translateParam);
    }
  }

  /**
   * Translate or not a text
   * @param translatableText
   */
  public translatableTextObs(translatableText: FlTranslatableText): Observable<string> | null {
    if (translatableText == null) return null;
    if (typeof translatableText === 'string') {
      return this.translateService.get(translatableText);
    } else if (translatableText.translateText === false) {
      return of(translatableText.text);
    } else {
      return this.translateService.get(translatableText.text, translatableText.translateParam?.param);
    }
  }

  /**
   * Returns a stream of translated values of a key (or an array of keys) which updates
   * whenever the language changes.
   * @returns A stream of the translated key, or an object of translated keys
   */
  public stream(key: string | Array<string>, params: FlTranslateParam = {}): Observable<string> {
    return this.translateService
      .stream(key, params.param)
      .pipe(map((text) => this.convertTranslatedTextCase(text, params.mode)));
  }

  /**
   * Convert the case of the text based on the mode
   * @param text string to convert
   * @param mode mode
   */
  private convertTranslatedTextCase(text: string, mode: FlTranslateMode | undefined): string {
    if (text == null || mode == null) {
      return text;
    }

    switch (mode) {
      case 'lowerCase':
        return text.toLowerCase();
      case 'upperCase':
        return text.toUpperCase();
      case 'capitalize':
        return ClStringHelper.capitalize(text);
    }
  }

  /**
   * Returns the user's browser preferred language within the available languages
   */
  public getUserLanguage(): ClSupportedLanguage {
    // get the language from the cookie if it exists
    const cookieLang: string | null = this.getUserLanguageCookie();

    // if it exists, returns the lang from the cookie
    if (cookieLang && this.langIsSupported(cookieLang)) {
      return cookieLang as ClSupportedLanguage;
    }

    if (this.platformService.isBrowserPlatform() && navigator?.languages?.length) {
      // get the user languages
      const languages: ReadonlyArray<string> = navigator.languages;

      // check if the language is available
      for (const lang of languages) {
        // if the language is available
        if (this.langIsSupported(lang)) {
          return lang as ClSupportedLanguage;
        }
      }
    }

    return this.getDefaultLanguage();
  }

  /**
   * Sets the translated value of a key, after compiling it
   */
  public setTranslation(key: string, value: string, lang?: ClSupportedLanguage): void {
    this.translateService.set(key, value, lang);
  }

  /**
   * Add translation for all supported lang
   */
  public addTranslation(value: FlTranslateObject): void {
    for (const key of Object.keys(value)) {
      this.translateService.setTranslation(key, value[key as keyof typeof value], true);
    }
  }

  /**
   * Add translation for all supported lang
   */
  public addModuleTranslation(moduleName: string, value: FlTranslateObject): void {
    // check if the translation has already been loaded
    if (this.modulesTranslation.indexOf(moduleName) === -1) {
      this.addTranslation(value);
      this.modulesTranslation.push(moduleName);
    }
  }

  /**
   * Return the language store in the cookies
   */
  public getUserLanguageCookie(): string | null {
    if (this.platformService.isBrowserPlatform() && this.cookieService.check(this.cookieKey))
      return this.cookieService.get(this.cookieKey);

    if (this.request?.cookies) return this.request?.cookies[this.cookieKey];
    return null;
  }

  /**
   * Set the user language and store it in the cookies
   * @param lang the language of the user
   */
  public changeAppLanguage(lang: ClSupportedLanguage): void {
    if (!clLangIsSupported(lang)) return;

    // do nothing if the lang didn't change
    if (this.getUserLanguageCookie() === lang) return;

    // set the language in the cookies
    this.cookieService.set(this.cookieKey, lang, this.getDateInTenYears(), '/', undefined, false);

    this.setAppLanguage(lang);
  }

  public get(key: string, data?: any): Observable<string> {
    return this.translateService.get(key, data);
  }

  /**
   * Set the lang for the translate service, date and date adapter
   */
  private setAppLanguage(lang: ClSupportedLanguage): void {
    // set the language in the translate service
    this.translateService.use(lang);

    // set the date local
    this.setDateLocale(lang);

    // set the material date adapter local (for date picker)
    this.adapter.setLocale(lang);
  }

  private getDateInTenYears(): Date {
    return new Date(new Date().getTime() + ClDateHelper.ONE_YEAR * 10);
  }

  private langIsSupported(lang: string): boolean {
    return this.config.availableLang.indexOf(lang as ClSupportedLanguage) !== -1;
  }

  // set the local for dates
  public setDateLocale(lang: ClSupportedLanguage): void {
    Settings.defaultLocale = lang;
  }

  public getDefaultLanguage(): ClSupportedLanguage {
    return this.config.defaultLang || ClSupportedLanguage.en;
  }
}
