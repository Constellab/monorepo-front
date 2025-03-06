import { bootstrapApplication } from '@angular/platform-browser';
import { dcProcessConfigGetAppConfig } from './dc-process-config.config-app';
import { DcProcessConfigComponent } from './dc-process-config/dc-process-config.component';

bootstrapApplication(DcProcessConfigComponent, dcProcessConfigGetAppConfig()).catch((err) =>
  console.error(err)
);
