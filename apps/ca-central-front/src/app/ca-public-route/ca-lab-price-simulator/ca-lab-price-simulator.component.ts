import { Component } from '@angular/core';
import { FlCardModule, FlTranslateModule } from '@monorepo/front-core-lib';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CaLabCoreModule } from '../../ca-core/entity-module/ca-lab-core/ca-lab-core.module';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { CaLabSelectStorageComponent } from '../../ca-core/entity-module/ca-lab-core/component/ca-lab-select-storage/ca-lab-select-storage.component';
import { CaLabSelectServerComponent } from '../../ca-core/entity-module/ca-lab-core/component/ca-lab-select-server/ca-lab-select-server.component';
import { CaRouterService } from '../../ca-core/service/ca-router.service';
import { CaEnvironmentHelper } from '../../ca-core/utils/ca-environment.helper';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ca-lab-price-simulator',
  standalone: true,
  imports: [
    FlCardModule,
    FlTranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CaLabCoreModule,
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
