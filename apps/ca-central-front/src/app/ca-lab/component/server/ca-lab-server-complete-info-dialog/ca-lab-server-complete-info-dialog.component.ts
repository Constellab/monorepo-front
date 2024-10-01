import {Component, Inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CaServerCompleteInfo} from '../../../../ca-core/model/entities/lab/ca-lab-server.class';
import {CaLabService} from '../../../../ca-core/service-api/ca-lab.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'ca-lab-server-complete-info-dialog',
  templateUrl: './ca-lab-server-complete-info-dialog.component.html',
  styleUrls: ['./ca-lab-server-complete-info-dialog.component.scss']
})
export class CaLabServerCompleteInfoDialogComponent implements OnInit {

  serverInfo$: Observable<CaServerCompleteInfo>
    = this.labService.getServerInfo(this.labId);

  constructor(private labService: CaLabService,
              @Inject(MAT_DIALOG_DATA) private labId: string) {
  }

  ngOnInit(): void {
  }

}
