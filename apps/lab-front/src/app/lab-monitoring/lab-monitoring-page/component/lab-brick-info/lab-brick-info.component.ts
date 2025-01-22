import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { LabBrickEntity } from '../../../../lab-core/model/entities/lab-brick.entity';
import { LabBrickService } from '../../../../lab-core/entity-service/lab-brick.service';
import { FlDialogService } from '@monorepo/front-core-lib';
import { LabBrickCallMigrationDialogComponent } from '../lab-brick-call-migration-dialog/lab-brick-call-migration-dialog.component';
import { LabTypeService } from '../../../../lab-core/entity-service/lab-type.service';
import { FlKeyValueModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { LabBrickMessageListComponent } from '../lab-brick-message-list/lab-brick-message-list.component';
import { TranslatePipe } from '@ngx-translate/core';

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
export class LabBrickInfoComponent implements OnInit {
  private labBrickService = inject(LabBrickService);
  private cdr = inject(ChangeDetectorRef);
  private dialogService = inject(FlDialogService);
  private typeService = inject(LabTypeService);

  @Input() brick: LabBrickEntity;

  generateDocIsLoading: boolean = false;

  ngOnInit(): void {}

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
