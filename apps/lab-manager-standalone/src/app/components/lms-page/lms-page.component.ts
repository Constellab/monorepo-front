import { Component, inject } from '@angular/core';
import {
  LmlLabManagerApiService,
  LmlLabManagerLibModule,
  LmlLabManagerState,
} from '@monorepo/lab-manager-lib';
import { LmsLabManagerApiService } from '../../service/lms-lab-manager-api.service';
import { LmsLabManagerState } from '../../service/lms-lab-manager.state';
import { LmsLabState } from '../../service/lms-lab.state';
import { LmsGlobalInfoComponent } from '../lms-global-info/lms-global-info.component';
import { LmsConfigureLabManagerComponent } from '../lms-configure-lab-manager/lms-configure-lab-manager.component';

@Component({
  selector: 'lms-page',
  standalone: true,
  imports: [LmlLabManagerLibModule, LmsGlobalInfoComponent, LmsConfigureLabManagerComponent],
  providers: [
    { provide: LmlLabManagerApiService, useClass: LmsLabManagerApiService },
    { provide: LmlLabManagerState, useClass: LmsLabManagerState },
    LmsLabState,
  ],
  templateUrl: './lms-page.component.html',
  styleUrl: './lms-page.component.scss',
})
export class LmsPageComponent {
  private state = inject(LmsLabState);

  labStatus = this.state.labManagerStatus;
}
