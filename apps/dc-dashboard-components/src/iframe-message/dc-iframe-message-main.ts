import { bootstrapApplication } from '@angular/platform-browser';
import { dcIframeMessageConfig } from './dc-iframe-message-app.config';
import { DcIframeMessageComponent } from './dc-iframe-message/dc-iframe-message.component';

bootstrapApplication(DcIframeMessageComponent, dcIframeMessageConfig()).catch((err) =>
  console.error(err)
);
