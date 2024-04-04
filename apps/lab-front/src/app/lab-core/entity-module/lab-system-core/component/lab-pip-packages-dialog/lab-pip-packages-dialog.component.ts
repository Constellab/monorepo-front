import {Component} from '@angular/core';
import {LabSystemService} from '../../../../service/lab-system.service';
import {Observable} from 'rxjs';
import {LabPipPackage} from '../../../../model/global/lab-system.class';

/**
 * Dialog to list the pip packages of the system
 */
@Component({
  selector: 'lab-pip-packages-dialog',
  templateUrl: './lab-pip-packages-dialog.component.html',
  styleUrl: './lab-pip-packages-dialog.component.scss'
})
export class LabPipPackagesDialogComponent {

  pipPackages$: Observable<LabPipPackage[]> = this.systemService.getInstalledPipPackages();

  constructor(private systemService: LabSystemService) {
  }

}
