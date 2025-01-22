import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaServerCompleteInfo } from '../../../../ca-core/model/entities/lab/ca-lab-server.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ca-lab-server-complete-info-dialog',
  templateUrl: './ca-lab-server-complete-info-dialog.component.html',
  styleUrls: ['./ca-lab-server-complete-info-dialog.component.scss'],
  standalone: false,
})
export class CaLabServerCompleteInfoDialogComponent implements OnInit {
  private labService = inject(CaLabService);
  private labId = inject(MAT_DIALOG_DATA);

  serverInfo$: Observable<CaServerCompleteInfo> = this.labService.getServerInfo(this.labId);

  ngOnInit(): void {}
}
