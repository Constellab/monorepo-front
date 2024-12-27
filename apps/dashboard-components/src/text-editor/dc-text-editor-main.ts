import { bootstrapApplication } from '@angular/platform-browser';
import { dcTextEditorGetAppConfig } from './dc-text-editor.config-app';
import { DcTextEditorComponent } from './dc-text-editor/dc-text-editor.component';

bootstrapApplication(DcTextEditorComponent, dcTextEditorGetAppConfig({})).catch((err) => console.error(err));
