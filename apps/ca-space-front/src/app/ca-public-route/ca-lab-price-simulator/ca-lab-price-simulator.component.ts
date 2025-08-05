import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterLink } from '@angular/router';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';

import { CaLabCreateSummaryComponent } from '../../ca-core/entity-module/ca-lab-core/component/ca-lab-create-summary/ca-lab-create-summary.component';
import { CaLabSelectServerComponent } from '../../ca-core/entity-module/ca-lab-core/component/ca-lab-select-server/ca-lab-select-server.component';
import { CaLabSelectStorageComponent } from '../../ca-core/entity-module/ca-lab-core/component/ca-lab-select-storage/ca-lab-select-storage.component';
import { CaRouterService } from '../../ca-core/service/ca-router.service';
import { CaEnvironmentHelper } from '../../ca-core/utils/ca-environment.helper';

@Component({
  selector: 'ca-lab-price-simulator',
  imports: [
    FlCardModule,
    FlTranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CaLabSelectServerComponent,
    CaLabSelectStorageComponent,
    CaLabCreateSummaryComponent,
    MatButtonModule,
    MatStepperModule,
    RouterLink,
  ],
  templateUrl: './ca-lab-price-simulator.component.html',
  styleUrl: './ca-lab-price-simulator.component.scss',
})
export class CaLabPriceSimulatorComponent {
  storageForm = CaLabSelectStorageComponent.createFormGp();

  serverForm = CaLabSelectServerComponent.createFormGp();

  signupRoute = CaRouterService.getSignupRoute();

  contactUsUrl = CaEnvironmentHelper.getContactUsPageUrl();
}
