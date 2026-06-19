import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatHint } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { LiRouterService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiSelectCredentialsComponent } from '../li-select-credentials/li-select-credentials.component';

/**
 * Component for dynamic field to search and select a credential
 */
@Component({
  selector: 'li-select-credentials-dynamic-field',
  templateUrl: './li-select-credentials-dynamic-field.component.html',
  styleUrls: ['./li-select-credentials-dynamic-field.component.scss'],
  imports: [
    FlFormModule,
    LiSelectCredentialsComponent,
    ReactiveFormsModule,
    MatError,
    MatHint,
    RouterLink,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LiSelectCredentialsDynamicFieldComponent extends FlDynamicFieldAbstractDirective {
  @Input() type?: string;

  credentialsRoute = LiRouterService.getMonitoringCredentialsRoute();
}
