import {Component, Input, OnInit} from '@angular/core';
import {CaLabInstanceService} from '../../../../ca-core/service-api/ca-lab-instance.service';
import {CaLabBackupOption} from '../../../../ca-core/model/entities/lab/ca-lab-backup.class';

@Component({
  selector: 'ca-lab-backup-options',
  templateUrl: './ca-lab-backup-options.component.html',
  styleUrls: ['./ca-lab-backup-options.component.scss'],
})
export class CaLabBackupOptionsComponent implements OnInit {

  @Input() labInstanceId: string;

  backupOption : CaLabBackupOption;

  isLoading = true;

  constructor(private labService: CaLabInstanceService) {
  }

  ngOnInit(): void {
    this.labService.getBackupOptions(this.labInstanceId).subscribe({
      next: (options) => {
        this.backupOption = options;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

}
