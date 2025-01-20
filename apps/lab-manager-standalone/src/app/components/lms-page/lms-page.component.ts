import { Component, inject } from '@angular/core';
import { LmlLabManagerLibModule, LmlLabManagerService, LmlLabManagerState } from '@monorepo/lab-manager-lib';
import { LmsLabManagerService } from '../../service/lms-lab-manager.service';
import { LmsLabState } from '../../service/lms-lab.state';
import { LmsGlobalInfoComponent } from '../lms-global-info/lms-global-info.component';
import { LmsConfigureLabManagerComponent } from '../lms-configure-lab-manager/lms-configure-lab-manager.component';

@Component({
    selector: 'lms-page',
    imports: [LmlLabManagerLibModule, LmsGlobalInfoComponent, LmsConfigureLabManagerComponent],
    providers: [
        { provide: LmlLabManagerService, useClass: LmsLabManagerService },
        LmlLabManagerState,
        LmsLabState,
    ],
    templateUrl: './lms-page.component.html',
    styleUrl: './lms-page.component.scss'
})
export class LmsPageComponent {
  private state = inject(LmsLabState);

  labStatus = this.state.labManagerStatus;
}
