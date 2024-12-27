import { bootstrapApplication } from '@angular/platform-browser';
import { dcSelectResourceGetAppConfig } from './dc-select-resource-app.config';
import { DcSelectResourceComponent } from './dc-select-resource/dc-select-resource.component';

bootstrapApplication(DcSelectResourceComponent, dcSelectResourceGetAppConfig({})).catch((err) =>
  console.error(err)
);
