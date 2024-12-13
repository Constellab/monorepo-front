import { Component, inject } from '@angular/core';
import { LmlAdminerInfo } from '../../model/lml-lab-manager.class';
import { LmlLabManagerApiService } from '../../lml-lab-manager-api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'lml-adminer-info-dialog',
  templateUrl: './lml-adminer-info-dialog.component.html',
  styleUrl: './lml-adminer-info-dialog.component.scss',
})
export class LmlAdminerInfoDialogComponent {
  private labManagerApiService = inject(LmlLabManagerApiService);
  adminerInfo$: Observable<LmlAdminerInfo> = this.labManagerApiService.getAdminerInfo();
}
