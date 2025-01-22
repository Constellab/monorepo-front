import { Component, inject, Input } from '@angular/core';
import { CaLabConfig } from '../../../../model/entities/lab/ca-lab-config.class';
import { CaBrickVersionComplete } from '../../../../model/entities/ca-brick.class';
import { FlDialogService } from '@monorepo/front-core-lib';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import {
  LmlBrickVersionDetailDialogComponent,
  LmlBrickVersionDetailDialogInput,
} from '@monorepo/lab-manager-lib';
import { FlKeyValueModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { MatAnchor, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-lab-config',
  templateUrl: './ca-lab-config.component.html',
  styleUrls: ['./ca-lab-config.component.scss'],
  imports: [FlKeyValueModule, MatAnchor, MatIconButton, MatTooltip, MatIcon, TranslatePipe],
})
export class CaLabConfigComponent {
  @Input({ required: true }) labConfig: CaLabConfig;

  private dialogService = inject(FlDialogService);
  private communityHelper = inject(CoCommunityHelperService);

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
