import { Component, inject, input } from '@angular/core';
import { MatAnchor, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import {
  LmlBrickVersionDetailDialogComponent,
  LmlBrickVersionDetailDialogInput,
} from '@monorepo/lab-manager-lib';
import { TranslatePipe } from '@ngx-translate/core';
import { CaBrickVersionComplete } from '../../../../model/entities/ca-brick.class';
import { CaLabConfig } from '../../../../model/entities/lab/ca-lab-config.class';

@Component({
  selector: 'ca-lab-config',
  templateUrl: './ca-lab-config.component.html',
  styleUrls: ['./ca-lab-config.component.scss'],
  imports: [FlKeyValueModule, MatAnchor, MatIconButton, MatTooltip, MatIcon, TranslatePipe],
})
export class CaLabConfigComponent {
  labConfig = input.required<CaLabConfig>();
  showDetailButton = input<boolean>(true);

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
