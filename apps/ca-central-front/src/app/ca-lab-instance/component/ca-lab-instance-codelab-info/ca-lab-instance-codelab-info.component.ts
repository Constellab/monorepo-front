import {Component, Inject, OnInit} from '@angular/core';
import {CaLabInstance} from '../../../ca-core/model/entities/lab/ca-lab-instance.class';
import {FlClipboardService} from '@monorepo/front-core-lib';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CoCommunityHelperService} from '@monorepo/community-lib';

/**
 * Dialog to show information about the codelab of a lab instance
 */
@Component({
  selector: 'ca-lab-instance-codelab-info',
  templateUrl: './ca-lab-instance-codelab-info.component.html',
  styleUrls: ['./ca-lab-instance-codelab-info.component.scss']
})
export class CaLabInstanceCodelabInfoComponent implements OnInit {

  labInstance: CaLabInstance;

  codelabUrl: string;
  communityHelpUrl: string;

  showCodeLabToken = false;

  constructor(@Inject(MAT_DIALOG_DATA) labInstance: CaLabInstance,
              private clipboardService: FlClipboardService,
              private communityHelper: CoCommunityHelperService) {
    this.labInstance = labInstance;
  }

  ngOnInit(): void {
    // eslint-disable-next-line max-len
    this.communityHelpUrl = this.communityHelper.getDevEnvironmentUrl();
    this.codelabUrl = `https://codelab.${this.labInstance.virtualHost}/?folder=/lab/user`;
  }

  copyToTokenToClipboard(): void {
    this.clipboardService.copy(this.labInstance.codelabToken,
      {text: 'codelab_token_copied', translateText: true});
  }

  toggleShowCodeLabToken(): void {
    this.showCodeLabToken = !this.showCodeLabToken;
  }
}
