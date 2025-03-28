import { Component, inject } from '@angular/core';
import { FlAuthModule } from '@monorepo/front-core-lib/fl-auth';
import { LiRouterService } from '@monorepo/lab-lib/li-core';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { LabEnvStore } from '../../../lab-core/lab-env.store';

@Component({
  selector: 'lab-login-page',
  templateUrl: './lab-login-page.component.html',
  styleUrls: ['./lab-login-page.component.scss'],
  imports: [FlAuthModule, MatButton, TranslatePipe],
})
export class LabLoginPageComponent {
  appRoute: string = LiRouterService.getAppRoute();

  labStore = inject(LabEnvStore);
  isDevEnv = this.labStore.isDev();

  switchToProd(): void {
    this.labStore.setLabEnvironment('prod');
  }
}
