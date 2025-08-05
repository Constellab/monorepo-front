import { bootstrapApplication } from '@angular/platform-browser';

import { DcIframeMessageComponent } from './dc-iframe-message/dc-iframe-message.component';
import { dcIframeMessageConfig } from './dc-iframe-message-app.config';

bootstrapApplication(DcIframeMessageComponent, dcIframeMessageConfig()).catch((err) =>
  console.error(err)
);
