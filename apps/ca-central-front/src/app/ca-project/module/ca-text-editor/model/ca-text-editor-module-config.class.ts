/**
 * Config for the {@link CaTextEditorModule}
 */
import {Type} from '@angular/core';
import {CaTextEditorElementDirective} from './ca-text-editor-element.directive';

export interface CaTextEditorModuleConfig {
  blots: CaTextEditorModuleConfigBlot[];
}

export interface CaTextEditorModuleConfigBlot {
  blot: any;
  componentType: Type<CaTextEditorElementDirective>;
}
