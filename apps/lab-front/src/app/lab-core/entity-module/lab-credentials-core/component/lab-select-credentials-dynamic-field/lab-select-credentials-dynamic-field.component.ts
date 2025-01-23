import { Component, Input } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib/fl-dynamic-field';
import { LabCredentialsType } from '../../../../model/entities/lab-credentials.entity';
import { LabRouterService } from '../../../../service/lab-router.service';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { LabSelectCredentialsComponent } from '../lab-select-credentials/lab-select-credentials.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatHint } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component for dynamic field to search and select a credential
 */
@Component({
  selector: 'lab-select-credentials-dynamic-field',
  templateUrl: './lab-select-credentials-dynamic-field.component.html',
  styleUrls: ['./lab-select-credentials-dynamic-field.component.scss'],
  imports: [
    FlFormModule,
    LabSelectCredentialsComponent,
    ReactiveFormsModule,
    MatError,
    MatHint,
    RouterLink,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LabSelectCredentialsDynamicFieldComponent extends FlDynamicFieldAbstractDirective {
  @Input() type?: LabCredentialsType;

  credentialsRoute = LabRouterService.getMonitoringCredentialsRoute();
}
