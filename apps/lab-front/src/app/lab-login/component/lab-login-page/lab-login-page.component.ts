import { Component, inject } from '@angular/core';
import { LabRouterService } from '../../../lab-core/service/lab-router.service';
import { LabEnvStore } from '../../../lab-core/service/lab-env.store';
import { FlAuthModule } from '@monorepo/front-core-lib/fl-auth';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-login-page',
  templateUrl: './lab-login-page.component.html',
  styleUrls: ['./lab-login-page.component.scss'],
  imports: [FlAuthModule, MatButton, TranslatePipe],
})
export class LabLoginPageComponent {
  appRoute: string = LabRouterService.getAppRoute();

  labStore = inject(LabEnvStore);
  isDevEnv = this.labStore.isDev();

  switchToProd(): void {
    this.labStore.setLabEnvironment('prod');
  }
}
