import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrProtocol } from '../../model/pr-protocol.class';
import { CoCommunityHelperService } from '@monorepo/community-lib';

export interface PrProcessInfoDialogInput{
  process: PrProtocol;
  communityHelper: CoCommunityHelperService;
}

@Component({
  selector: 'pr-process-info-dialog',
  templateUrl: './pr-process-info-dialog.component.html',
  styleUrl: './pr-process-info-dialog.component.scss'
})
export class PrProcessInfoDialogComponent {

  input: PrProcessInfoDialogInput = inject(MAT_DIALOG_DATA);
}
