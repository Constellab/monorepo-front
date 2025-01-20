import { Component, inject } from '@angular/core';
import { LmlAdminerInfo } from '../../model/lml-lab-manager.class';
import { LmlLabManagerService } from '../../lml-lab-manager.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'lml-adminer-info-dialog',
    templateUrl: './lml-adminer-info-dialog.component.html',
    styleUrl: './lml-adminer-info-dialog.component.scss',
    standalone: false
})
export class LmlAdminerInfoDialogComponent {
  private labManagerApiService = inject(LmlLabManagerService);
  adminerInfo$: Observable<LmlAdminerInfo> = this.labManagerApiService.getAdminerInfo();
}
