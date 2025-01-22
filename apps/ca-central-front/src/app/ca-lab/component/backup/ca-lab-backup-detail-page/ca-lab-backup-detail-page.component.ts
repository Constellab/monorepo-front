import { Component, OnInit, inject } from '@angular/core';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';

@Component({
  selector: 'ca-lab-backup-detail-page',
  templateUrl: './ca-lab-backup-detail-page.component.html',
  styleUrls: ['./ca-lab-backup-detail-page.component.scss'],
  standalone: false,
})
export class CaLabBackupDetailPageComponent implements OnInit {
  private state = inject(CaLabDetailPageState);

  labId: string;

  ngOnInit(): void {
    this.labId = this.state.getLabId();
  }
}
