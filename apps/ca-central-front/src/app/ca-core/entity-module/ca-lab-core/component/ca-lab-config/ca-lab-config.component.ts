import { Component, Input } from '@angular/core';
import { CaLabConfig } from '../../../../model/entities/lab/ca-lab-config.class';
import { CaBrickVersionComplete } from '../../../../model/entities/ca-brick.class';
import { FlDialogService } from '@monorepo/front-core-lib';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import {
  LmlBrickVersionDetailDialogComponent,
  LmlBrickVersionDetailDialogInput,
} from '@monorepo/lab-manager-lib';

@Component({
  selector: 'ca-lab-config',
  templateUrl: './ca-lab-config.component.html',
  styleUrls: ['./ca-lab-config.component.scss'],
})
export class CaLabConfigComponent {
  @Input() labConfig: CaLabConfig;

  constructor(
    private dialogService: FlDialogService,
    private communityHelper: CoCommunityHelperService
  ) {}

  getBrickLink(brickVersion: CaBrickVersionComplete): string {
    return this.communityHelper.getBrickUrl(brickVersion.brick.name, brickVersion.version);
  }

  openBrickVersionDetail(brickVersion: CaBrickVersionComplete): void {
    const data: LmlBrickVersionDetailDialogInput = {
      brickName: brickVersion.brick.name,
      brickVersion: brickVersion.version,
    };

    this.dialogService.openSmallDialog(LmlBrickVersionDetailDialogComponent, { data });
  }
}
