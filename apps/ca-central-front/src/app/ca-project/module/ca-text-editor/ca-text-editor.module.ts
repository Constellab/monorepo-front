import {Inject, Injector, ModuleWithProviders, NgModule, PLATFORM_ID} from '@angular/core';
import {CaTextEditorComponent} from './component/ca-text-editor/ca-text-editor.component';
import {
  CaTextEditorBlockAddButtonComponent
} from './component/ca-text-editor-block-add-button/ca-text-editor-block-add-button.component';
import {CaTextEditorFigureComponent} from './component/ca-text-editor-figure/ca-text-editor-figure.component';
import {
  CaTextEditorDragButtonsComponent
} from './component/ca-text-editor-drag-buttons/ca-text-editor-drag-buttons.component';
import {
  CaTextEditorTitleCaptionComponent
} from './component/ca-text-editor-title-caption/ca-text-editor-title-caption.component';
import {CaTextEditorVideoComponent} from './component/ca-text-editor-video/ca-text-editor-video.component';
import {
  CaTextEditorLinkDialogComponent
} from './component/ca-text-editor-link-dialog/ca-text-editor-link-dialog.component';
import {
  CaTextEditorSnowButtonComponent
} from './component/ca-text-editor-snow-button/ca-text-editor-snow-button.component';
import {CaTextEditorDirective} from './directive/ca-text-editor.directive';
import {CaTextEditorFormulaComponent} from './component/ca-text-editor-formula/ca-text-editor-formula.component';
import {
  CaTextEditorFormulaDialogComponent
} from './component/ca-text-editor-formula-dialog/ca-text-editor-formula-dialog.component';
import {CommonModule, isPlatformServer} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CaCustomLibraryModule} from '../../../ca-core/custom-library/ca-custom-library.module';
import {CaCustomMaterialModule} from '../../../ca-core/custom-material/ca-custom-material.module';
import {CaTextEditorModuleConfig, CaTextEditorModuleConfigBlot} from './model/ca-text-editor-module-config.class';
import {FlResizeModule, FlTranslateService} from '@monorepo/front-core-lib';
import {CaTextEditorHintBlot} from './model/ca-text-editor-hint-blot.class';
import {CaTextEditorHeaderId} from './model/ca-text-editor-header-id.class';
import {CaTextEditorLink} from './model/ca-text-editor-link-without-target.class';
import {CaTextEditorFigureBlot} from './model/ca-text-editor-figure-blot.class';
import {CaTextEditorFormulaBlot} from './model/ca-text-editor-formula-blot.class';
import {CaTextEditorVideoBlot} from './model/ca-text-editor-video-blot.class';
import {createCustomElement} from '@angular/elements';


@NgModule({
  declarations: [
    CaTextEditorComponent,
    CaTextEditorBlockAddButtonComponent,
    CaTextEditorFigureComponent,
    CaTextEditorTitleCaptionComponent,
    CaTextEditorDragButtonsComponent,
    CaTextEditorVideoComponent,
    CaTextEditorLinkDialogComponent,
    CaTextEditorSnowButtonComponent,
    CaTextEditorDirective,
    CaTextEditorFormulaComponent,
    CaTextEditorFormulaDialogComponent,
  ],
  exports: [
    CaTextEditorComponent,
    CaTextEditorTitleCaptionComponent,
    CaTextEditorDirective,
    CaTextEditorFormulaComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CaCustomLibraryModule,
    CaCustomMaterialModule,
    FlResizeModule
  ],
})
export class CaTextEditorModule {
  private static registered: boolean = false;

  private static config: CaTextEditorModuleConfig;

  constructor(
    injector: Injector,
    translateService: FlTranslateService,
    // eslint-disable-next-line @typescript-eslint/ban-types
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    if (CaTextEditorModule.registered) return;
    if (isPlatformServer(platformId)) return;

    import('quill').then((quillImport) => {
      // register default blots
      quillImport.default.register(CaTextEditorHintBlot, true);
      quillImport.default.register(CaTextEditorHeaderId, true);
      quillImport.default.register(CaTextEditorLink, true);

      CaTextEditorModule.registered = true;

      const blots: CaTextEditorModuleConfigBlot[] = [
        {
          blot: CaTextEditorFigureBlot,
          componentType: CaTextEditorFigureComponent,
        },
        {
          blot: CaTextEditorFormulaBlot,
          componentType: CaTextEditorFormulaComponent,
        },
        {
          blot: CaTextEditorVideoBlot,
          componentType: CaTextEditorVideoComponent,
        },
        ...CaTextEditorModule.config.blots,
      ];

      // Register quill blots
      for (const blot of blots) {
        quillImport.default.register(blot.blot, true);

        // declare the CaTextEditorFigureComponent as angular element to make the tag
        // fl-text-editor-figure
        if (!customElements.get(blot.blot.tagName.toLowerCase())) {
          customElements.define(
            blot.blot.tagName.toLowerCase(),
            createCustomElement(blot.componentType, {injector: injector})
          );
        }
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public static forRoot(
    config: CaTextEditorModuleConfig
  ): ModuleWithProviders<CaTextEditorModule> {
    CaTextEditorModule.config = config;

    return {
      ngModule: CaTextEditorModule,
    };
  }
}
