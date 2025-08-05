import { Component, inject, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDialogModule, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaSpaceInvit,
  CaSpaceInvitDatasource,
} from '../../../../ca-core/model/entities/space/ca-space-invit.class';
import { CaCurrentSpaceService } from '../../../../ca-core/service-api/ca-current-space.service';
import { CaSpaceInvitService } from '../../../../ca-core/service-api/ca-space-invit.service';
import {
  CaSpaceInvitFormDialogComponent,
  CaSpaceInvitFormDialogInput,
} from '../ca-space-invit-form-dialog/ca-space-invit-form-dialog.component';
import { CaSpaceInvitTableComponent } from '../ca-space-invit-table/ca-space-invit-table.component';

/**
 * List the invitations of the space
 */
@Component({
  selector: 'ca-current-space-invit-dialog',
  templateUrl: './ca-current-space-invit-dialog.component.html',
  styleUrls: ['./ca-current-space-invit-dialog.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    FlInfiniteScrollModule,
    CaSpaceInvitTableComponent,
    TranslatePipe,
    FlDialogModule,
  ],
})
export class CaCurrentSpaceInvitDialogComponent implements OnInit {
  private spaceInvitService = inject(CaSpaceInvitService);
  private dialogService = inject(FlDialogService);
  private currentSpaceService = inject(CaCurrentSpaceService);

  invitations: CaSpaceInvitDatasource;

  ngOnInit(): void {
    this.invitations = this.spaceInvitService.getInvitationsDatasource('current');
  }

  async openInvitationDialog(): Promise<void> {
    const space = await this.currentSpaceService.getCurrentSpacePromise();
    const input: CaSpaceInvitFormDialogInput = {
      spaceId: space.id,
      spaceType: space.type,
    };
    this.dialogService
      .openSmallDialog(CaSpaceInvitFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((invitation) => this.onInvitationClosed(invitation));
  }

  private onInvitationClosed(invitation?: CaSpaceInvit): void {
    if (invitation) {
      this.invitations.addItem(invitation);
    }
  }
}
