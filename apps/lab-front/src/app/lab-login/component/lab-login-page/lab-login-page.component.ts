import { Component, inject } from '@angular/core';
import { LabRouterService } from '../../../lab-core/service/lab-router.service';
import { LabEnvStore } from '../../../lab-core/service/lab-env.store';

@Component({
    selector: 'lab-login-page',
    templateUrl: './lab-login-page.component.html',
    styleUrls: ['./lab-login-page.component.scss'],
    standalone: false
})
export class LabLoginPageComponent {
  appRoute: string = LabRouterService.getAppRoute();

  labStore = inject(LabEnvStore);
  isDevEnv = this.labStore.isDev();

  switchToProd(): void {
    this.labStore.setLabEnvironment('prod');
  }
}
