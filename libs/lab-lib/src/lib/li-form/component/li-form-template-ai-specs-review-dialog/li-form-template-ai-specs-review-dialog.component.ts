import { ChangeDetectionStrategy,Component, inject, OnDestroy, OnInit, signal, ViewContainerRef } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA,MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { FlDialogModule, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import {
  TdEditParamSpecDialogComponent,
  TdEditParamSpecDialogInput,
  TdParamSpecEntry,
  TdParamSpecs,
  TdTechnicalDocModule,
} from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

import { LiFormTemplateVersion } from '../../../li-core/model/entities/form/li-form-template-version.entity';
import { LiFormTemplateService } from '../../service/li-form-template.service';
import { LiFormTemplateAiReviewSpecsState } from './li-form-template-ai-review-specs.state';

export interface LiFormTemplateAiSpecsReviewDialogInput {
  templateId: string;
  versionId: string;
  /** Proposed full field set returned by the AI (preview, not yet persisted). */
  proposedSpecs: TdParamSpecs;
}

/**
 * Reviews an AI-proposed full field specification. The user can edit / add / delete /
 * reorder fields locally, then apply the complete set — which overrides the draft on
 * the backend and returns the updated version (closed value of the dialog).
 */
@Component({
  selector: 'li-form-template-ai-specs-review-dialog',
  templateUrl: './li-form-template-ai-specs-review-dialog.component.html',
  styleUrl: './li-form-template-ai-specs-review-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    FlLoaderModule,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatIcon,
    TranslatePipe,
    TdTechnicalDocModule,
  ],
})
export class LiFormTemplateAiSpecsReviewDialogComponent implements OnInit, OnDestroy {
  private dialogRef =
    inject<MatDialogRef<LiFormTemplateAiSpecsReviewDialogComponent, LiFormTemplateVersion>>(MatDialogRef);
  private dialogService = inject(FlDialogService);
  private viewContainerRef = inject(ViewContainerRef);
  private snackBar = inject(FlSnackBarService);
  private formTemplateService = inject(LiFormTemplateService);

  data = inject<LiFormTemplateAiSpecsReviewDialogInput>(MAT_DIALOG_DATA);

  state: LiFormTemplateAiReviewSpecsState;
  isApplying = signal(false);
  hasFields = signal(false);

  ngOnInit(): void {
    this.state = new LiFormTemplateAiReviewSpecsState(
      this.formTemplateService,
      this.data.templateId,
      this.data.versionId
    );
    this.state.setParamSpecs(this.data.proposedSpecs ?? {});
    this.updateHasFields();
  }

  ngOnDestroy(): void {
    this.state?.ngOnDestroy();
  }

  editField(entry: TdParamSpecEntry): void {
    const input: TdEditParamSpecDialogInput = {
      dynamicParamSpecState: this.state,
      paramSpec: entry,
      title: { text: 'li.form_edit_field', translateText: true },
    };

    this.dialogService
      .openMediumDialog(TdEditParamSpecDialogComponent, {
        data: input,
        viewContainerRef: this.viewContainerRef,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe(() => this.updateHasFields());
  }

  deleteField(entry: TdParamSpecEntry): void {
    // In-memory only (nothing persisted until apply) — delete directly, no confirmation.
    this.state.deleteParamSpec(entry.key).subscribe(() => this.updateHasFields());
  }

  reorderFields(fieldNames: string[]): void {
    this.state.reorderParamSpecs(fieldNames)?.subscribe();
  }

  apply(): void {
    this.isApplying.set(true);
    this.formTemplateService
      .overrideSpecs(this.data.templateId, this.data.versionId, this.state.getCurrentSpecs())
      .subscribe({
        next: (version) => {
          this.snackBar.openSuccessMessage({ text: 'li.form_ai_specs_applied', translateText: true });
          this.dialogRef.close(version);
        },
        error: () => this.isApplying.set(false),
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private updateHasFields(): void {
    this.hasFields.set(Object.keys(this.state.getCurrentSpecs()).length > 0);
  }
}
