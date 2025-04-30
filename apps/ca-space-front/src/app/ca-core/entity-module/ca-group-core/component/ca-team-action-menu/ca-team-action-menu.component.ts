import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CaGroup } from '../../../../model/entities/ca-group.entity';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import {
  CaTeamFormDialogComponent,
  CaTeamFormDialogInput,
} from '../ca-team-form-dialog/ca-team-form-dialog.component';
import { CaGroupService } from '../../../../service-api/ca-group.service';
import { ClHelpService } from '@monorepo/core-lib';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Action menu button to edit or delete a team
 */
@Component({
  selector: 'ca-team-action-menu',
  templateUrl: './ca-team-action-menu.component.html',
  styleUrls: ['./ca-team-action-menu.component.scss'],
  imports: [MatIconButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem, MatTooltip, TranslatePipe],
})
export class CaTeamActionMenuComponent {
  private dialogService = inject(FlDialogService);
  private groupService = inject(CaGroupService);

  @Input() team: CaGroup;

  @Input() stopClickEvent: boolean = false;

  @Output() teamDeleted: EventEmitter<CaGroup> = new EventEmitter();

  stopEvent(event: MouseEvent): void {
    if (this.stopClickEvent) ClHelpService.stopEventPropagation(event);
  }

  openUpdateDialog(): void {
    const data: CaTeamFormDialogInput = {
      mode: 'update',
      object: {
        id: this.team.id,
        label: this.team.label,
      },
    };

    this.dialogService
      .openSmallDialog(CaTeamFormDialogComponent, { data: data })
      .afterClosed()
      .subscribe((group) => this.onUpdateClosed(group));
  }

  private onUpdateClosed(group?: CaGroup): void {
    if (group) {
      this.team.label = group.label;
    }
  }

  openDeleteDialog(): void {
    const data: FlConfirmDialogInput = {
      title: 'delete_team',
      content: 'delete_team_confirmation',
      observable: this.groupService.deleteTeamById(this.team.id),
      successMessage: 'team_deleted',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result));
  }

  private onDeleteClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.teamDeleted.emit(this.team);
    }
  }
}
