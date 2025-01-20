import { Component } from '@angular/core';
import { LabSystemService } from '../../../../service/lab-system.service';
import { Observable } from 'rxjs';
import { LabSystemConfig } from '../../../../model/global/lab-system.class';

/**
 * Dialog to list the pip packages of the system
 */
@Component({
    selector: 'lab-system-config-dialog',
    templateUrl: './lab-system-config-dialog.component.html',
    styleUrl: './lab-system-config-dialog.component.scss',
    standalone: false
})
export class LabSystemConfigDialogComponent {
  systemConfig$: Observable<LabSystemConfig> = this.systemService.getSystemConfig();

  constructor(private systemService: LabSystemService) {}
}
