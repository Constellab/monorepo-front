import {Component, Inject, OnInit} from '@angular/core';
import {CaLabCodelabDTO} from '../../../ca-core/model/entities/lab/ca-lab-instance.class';
import {CoCommunityHelperService} from '@monorepo/community-lib';
import {FlClipboardService} from '@monorepo/front-core-lib';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {CaLabInstanceService} from '../../../ca-core/service-api/ca-lab-instance.service';

/**
 * Dialog to show information about the codelab of a lab instance
 */
@Component({
  selector: 'ca-lab-instance-codelab-info',
  templateUrl: './ca-lab-instance-codelab-info.component.html',
  styleUrls: ['./ca-lab-instance-codelab-info.component.scss']
})
export class CaLabInstanceCodelabInfoComponent implements OnInit {

  codelabInfo$: Observable<CaLabCodelabDTO>;

  communityHelpUrl: string;

  showCodeLabToken = false;

  constructor(@Inject(MAT_DIALOG_DATA) private labInstanceId: string,
              private labService: CaLabInstanceService,
              private clipboardService: FlClipboardService,
              private communityHelper: CoCommunityHelperService) {
  }

  ngOnInit(): void {
    this.communityHelpUrl = this.communityHelper.getDevEnvironmentUrl();
    this.codelabInfo$ = this.labService.findCodelabInfo(this.labInstanceId);
  }

  copyToTokenToClipboard(codelabInfo: CaLabCodelabDTO): void {
    this.clipboardService.copy(codelabInfo.token,
      {text: 'codelab_token_copied', translateText: true});
  }

  toggleShowCodeLabToken(): void {
    this.showCodeLabToken = !this.showCodeLabToken;
  }
}
