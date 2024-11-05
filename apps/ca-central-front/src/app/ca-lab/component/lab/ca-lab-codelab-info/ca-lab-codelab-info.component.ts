import { Component, Inject, OnInit } from '@angular/core';
import { CaLabCodelabDTO } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { FlClipboardService } from '@monorepo/front-core-lib';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';

/**
 * Dialog to show information about the codelab of a lab
 */
@Component({
  selector: 'ca-lab-codelab-info',
  templateUrl: './ca-lab-codelab-info.component.html',
  styleUrls: ['./ca-lab-codelab-info.component.scss'],
})
export class CaLabCodelabInfoComponent implements OnInit {
  codelabInfo$: Observable<CaLabCodelabDTO>;

  communityHelpUrl: string;

  showCodeLabToken = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private labId: string,
    private labService: CaLabService,
    private clipboardService: FlClipboardService,
    private communityHelper: CoCommunityHelperService
  ) {}

  ngOnInit(): void {
    this.communityHelpUrl = this.communityHelper.getDevEnvironmentUrl();
    this.codelabInfo$ = this.labService.findCodelabInfo(this.labId);
  }

  copyToTokenToClipboard(codelabInfo: CaLabCodelabDTO): void {
    this.clipboardService.copy(codelabInfo.token, { text: 'codelab_token_copied', translateText: true });
  }

  toggleShowCodeLabToken(): void {
    this.showCodeLabToken = !this.showCodeLabToken;
  }
}
