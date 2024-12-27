import { Component, inject, Injector, OnInit, signal } from '@angular/core';
import { DC_APP_DATA } from '../dc-text-editor.config-app';
import { TeRichText, TeRichTextDTO, TeTextEditorModule } from '@monorepo/text-editor';
import {
  flSetRootInjector,
  FlThemeService,
  FlTranslateModule,
  FlTranslateService,
} from '@monorepo/front-core-lib';
import { RenderData, Streamlit } from 'streamlit-component-lib';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { dcI18n } from './dc-text-editor.i18n';
import { DcTextEditorConfig } from './dc-text-editor.config';
import { ClTheme } from '@monorepo/core-lib';

export interface DcRichTextConfig {
  placeholder: string;
  initial_value: TeRichTextDTO;
  disabled: boolean;
  // config: {
  //   api_url: string;
  //   image_folder: string;
  // };
}

@Component({
  standalone: true,
  imports: [TeTextEditorModule, ReactiveFormsModule, FlTranslateModule],
  selector: 'dc-root',
  templateUrl: './dc-text-editor.component.html',
  styleUrl: './dc-text-editor.component.scss',
})
export class DcTextEditorComponent implements OnInit {
  placeholder = signal<string>(null);

  data: any = inject<any>(DC_APP_DATA);

  textEditorConfig: DcTextEditorConfig;

  formCtrl = new FormControl<TeRichText>(null);

  private isInitialized: boolean = false;

  private themeService = inject(FlThemeService);

  saveFunc = (value: TeRichText): Observable<any> => {
    Streamlit.setComponentValue(value.toJson());
    return of(value.toJson());
  };

  constructor(injector: Injector, translateService: FlTranslateService) {
    flSetRootInjector(injector);
    translateService.addModuleTranslation('dc', dcI18n);
  }

  ngOnInit(): void {
    Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, (event: Event) => {
      const customEvent: CustomEvent<RenderData<DcRichTextConfig>> = event as CustomEvent<RenderData>;

      const clTheme: ClTheme =
        customEvent.detail.theme.base === 'dark' ? ClTheme.DARK_THEME : ClTheme.LIGHT_THEME;
      this.themeService.changeTheme(clTheme);

      const data = customEvent.detail.args;
      this.placeholder.set(data.placeholder);

      if (!this.isInitialized) {
        if (data.initial_value) {
          const richText = new TeRichText(data.initial_value);
          this.formCtrl.setValue(richText, { emitEvent: false });
          Streamlit.setComponentValue(data.initial_value);
        }

        this.textEditorConfig = new DcTextEditorConfig();
      }

      if (data.disabled !== this.formCtrl.disabled) {
        if (data.disabled) {
          this.formCtrl.disable();
        } else {
          this.formCtrl.enable();
        }
      }

      Streamlit.setFrameHeight();
      this.isInitialized = true;
    });

    Streamlit.setComponentReady();
    Streamlit.setFrameHeight();
  }

  onChange(): void {
    Streamlit.setFrameHeight();
  }
}
