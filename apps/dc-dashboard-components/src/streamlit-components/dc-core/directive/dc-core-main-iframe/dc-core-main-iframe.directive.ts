import { Directive, inject, OnDestroy, OnInit } from '@angular/core';
import { RenderData, Streamlit } from 'streamlit-component-lib';
import { ClTheme } from '@monorepo/core-lib';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { Observable, Subject } from 'rxjs';
import { DcComponentData } from '../../../../core/model/dc-dynamic-component.class';

/**
 * Directive for the main component of the dashboard components for dev environment
 * It listens to the Streamlit events and initializes the component
 */
@Directive({
  selector: '[dcCoreMainIframe]',
})
export class DcCoreMainIframeDirective implements OnInit, OnDestroy {
  public isInitialized: boolean = false;
  private themeService = inject(FlThemeService);

  private initialized: Subject<DcComponentData> = new Subject();

  ngOnInit(): void {
    Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, (event: Event) => {
      const customEvent: CustomEvent<RenderData> = event as CustomEvent<RenderData>;

      const clTheme: ClTheme =
        customEvent.detail.theme.base === 'dark' ? ClTheme.DARK_THEME : ClTheme.LIGHT_THEME;
      this.themeService.changeTheme(clTheme);

      if (!this.isInitialized) {
        const data: DcComponentData = customEvent.detail.args;

        this.initialized.next(data);
        this.initialized.complete();
      }

      this.isInitialized = true;
    });

    Streamlit.setComponentReady();
  }

  public getInitData(): Observable<DcComponentData> {
    return this.initialized.asObservable();
  }

  ngOnDestroy(): void {
    this.initialized.unsubscribe();
  }
}
