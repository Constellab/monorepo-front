import {Component, OnInit} from '@angular/core';
import {CaLabInstanceDetailPageState} from '../../../state/ca-lab-instance-detail-page.state';

@Component({
  selector: 'ca-lab-backup-detail-page',
  templateUrl: './ca-lab-backup-detail-page.component.html',
  styleUrls: ['./ca-lab-backup-detail-page.component.scss'],
})
export class CaLabBackupDetailPageComponent implements OnInit {

  labId: string;

  constructor(private state: CaLabInstanceDetailPageState) {
  }

  ngOnInit(): void {
    this.labId = this.state.getLabInstanceId();
  }


}
