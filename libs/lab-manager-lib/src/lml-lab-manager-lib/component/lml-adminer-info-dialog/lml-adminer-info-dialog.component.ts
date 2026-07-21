import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { LmlLabManagerService } from '../../lml-lab-manager.service';
import { LmlAdminerInfo } from '../../model/lml-lab-manager.class';

@Component({
  selector: 'lml-adminer-info-dialog',
  templateUrl: './lml-adminer-info-dialog.component.html',
  styleUrl: './lml-adminer-info-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LmlAdminerInfoDialogComponent {
  private labManagerApiService = inject(LmlLabManagerService);
  adminerInfo$: Observable<LmlAdminerInfo> = this.labManagerApiService.getAdminerInfo();
}
