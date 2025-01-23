import { Component, inject, OnInit } from '@angular/core';
import {
  CaSpaceInvit,
  CaSpaceInvitDatasource,
} from '../../../../ca-core/model/entities/space/ca-space-invit.class';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  CaSpaceInvitFormDialogComponent,
  CaSpaceInvitFormDialogInput,
} from '../ca-space-invit-form-dialog/ca-space-invit-form-dialog.component';
import { CaCurrentSpaceService } from '../../../../ca-core/service-api/ca-current-space.service';
import { CaSpaceInvitService } from '../../../../ca-core/service-api/ca-space-invit.service';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { CaSpaceInvitTableComponent } from '../ca-space-invit-table/ca-space-invit-table.component';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * List the invitations of the space
 */
@Component({
  selector: 'ca-current-space-invit-list',
  templateUrl: './ca-current-space-invit-list.component.html',
  styleUrls: ['./ca-current-space-invit-list.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    FlInfiniteScrollModule,
    CaSpaceInvitTableComponent,
    TranslatePipe,
  ],
})
export class CaCurrentSpaceInvitListComponent implements OnInit {
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
