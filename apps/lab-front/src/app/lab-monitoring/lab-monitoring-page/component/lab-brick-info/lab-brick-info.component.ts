import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject,Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { LiBrickEntity, LiBrickService, LiTypeService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LabBrickCallMigrationDialogComponent } from '../lab-brick-call-migration-dialog/lab-brick-call-migration-dialog.component';
import { LabBrickMessageListComponent } from '../lab-brick-message-list/lab-brick-message-list.component';

/**
 * Show information and messages about a brick
 */
@Component({
  selector: 'lab-brick-info',
  templateUrl: './lab-brick-info.component.html',
  styleUrls: ['./lab-brick-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FlKeyValueModule, MatButton, FlLoaderModule, LabBrickMessageListComponent, TranslatePipe],
})
export class LabBrickInfoComponent {
  private labBrickService = inject(LiBrickService);
  private cdr = inject(ChangeDetectorRef);
  private dialogService = inject(FlDialogService);
  private typeService = inject(LiTypeService);

  @Input() brick: LiBrickEntity;

  generateDocIsLoading: boolean = false;

  generateTechnicalDoc(): void {
    this.generateDocIsLoading = true;
    this.labBrickService.generateTechnicalDoc(this.brick.name).subscribe({
      next: () => this.onComplete(),
      error: () => this.onComplete(),
    });
  }

  openCallMigrationDialog(): void {
    this.dialogService.openMediumDialog(LabBrickCallMigrationDialogComponent, { data: this.brick.name });
  }

  private onComplete(): void {
    this.generateDocIsLoading = false;
    this.cdr.markForCheck();
  }

  deleteUnavailableTypings(): void {
    this.dialogService.openConfirmDialog({
      title: 'monitoring.delete_unavailable_typings',
      content: 'monitoring.delete_unavailable_typings_confirmation',
      observable: this.typeService.deleteUnavailableTypings(this.brick.name),
      successMessage: 'monitoring.delete_unavailable_typings_success',
    });
  }
}
