import {Component, Input} from '@angular/core';
import {FlDynamicFieldAbstractDirective} from '@monorepo/front-core-lib';
import {LabCredentialsType} from '../../../../model/entities/lab-credentials.entity';
import {LabRouterService} from '../../../../service/lab-router.service';

/**
 * Component for dynamic field to search and select a credential
 */
@Component({
  selector: 'lab-select-credentials-dynamic-field',
  templateUrl: './lab-select-credentials-dynamic-field.component.html',
  styleUrls: ['./lab-select-credentials-dynamic-field.component.scss'],
})
export class LabSelectCredentialsDynamicFieldComponent extends FlDynamicFieldAbstractDirective {

  @Input() type?: LabCredentialsType;

  credentialsRoute = LabRouterService.getMonitoringCredentialsRoute();
}
