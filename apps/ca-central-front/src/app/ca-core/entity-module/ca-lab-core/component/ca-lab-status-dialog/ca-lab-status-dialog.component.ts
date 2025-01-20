import { Component, Inject, OnInit } from '@angular/core';
import { CaLabService } from '../../../../service-api/ca-lab.service';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Dialog to check the lab status
 */
@Component({
    selector: 'ca-lab-status-dialog',
    templateUrl: './ca-lab-status-dialog.component.html',
    styleUrls: ['./ca-lab-status-dialog.component.scss'],
    standalone: false
})
export class CaLabStatusDialogComponent implements OnInit {
  status$: Observable<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private labId: string,
    private labService: CaLabService
  ) {}

  ngOnInit(): void {
    this.status$ = this.labService.checkStatus(this.labId);
  }
}
