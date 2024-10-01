import { Component, OnInit } from '@angular/core';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';

@Component({
  selector: 'ca-lab-backup-detail-page',
  templateUrl: './ca-lab-backup-detail-page.component.html',
  styleUrls: ['./ca-lab-backup-detail-page.component.scss'],
})
export class CaLabBackupDetailPageComponent implements OnInit {

  labId: string;

  constructor(private state: CaLabDetailPageState) {
  }

  ngOnInit(): void {
    this.labId = this.state.getLabId();
  }


}
