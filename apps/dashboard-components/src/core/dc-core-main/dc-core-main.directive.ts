import { Directive, inject, OnInit } from '@angular/core';
import { RenderData, Streamlit } from 'streamlit-component-lib';
import { ClTheme } from '@monorepo/core-lib';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { Observable, Subject } from 'rxjs';

/**
 * Directive for the main component of the dashboard components
 */
@Directive({
  selector: '[dcCoreMain]',
})
export class DcCoreMainDirective implements OnInit {
  public isInitialized: boolean = false;
  private themeService = inject(FlThemeService);

  private initialized: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, (event: Event) => {
      const customEvent: CustomEvent<RenderData> = event as CustomEvent<RenderData>;

      const clTheme: ClTheme =
        customEvent.detail.theme.base === 'dark' ? ClTheme.DARK_THEME : ClTheme.LIGHT_THEME;
      this.themeService.changeTheme(clTheme);

      if (!this.isInitialized) {
        const data = customEvent.detail.args;
        this.initialized.next(data);
        this.initialized.complete();
      }

      this.isInitialized = true;
    });

    Streamlit.setComponentReady();
  }

  public getInitData(): Observable<any> {
    return this.initialized.asObservable();
  }
}
