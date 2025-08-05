import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HaDifyKnowledgeBase } from '../../../ha-core/ha-model/ha-entities/ha-dify.class';
import { HaEntityType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type';
import { HaDifyService } from '../../../ha-core/ha-service/ha-dify.service';

export interface HaAdminSendToDifyDialogInput {
  entityType: HaEntityType;
  entityId?: string;
}

@Component({
  selector: 'ha-admin-send-to-dify-dialog',
  imports: [
    FlDialogModule,
    TranslatePipe,
    FlLoaderModule,
    MatButton,
    MatFormField,
    MatSelect,
    FormsModule,
    MatOption,
    MatLabel,
    MatInput,
    AsyncPipe,
  ],
  templateUrl: './ha-admin-send-to-dify-dialog.component.html',
  styleUrl: './ha-admin-send-to-dify-dialog.component.scss',
})
export class HaAdminSendToDifyDialogComponent {
  private difyService = inject(HaDifyService);
  private dialogRef = inject<MatDialogRef<HaAdminSendToDifyDialogComponent>>(MatDialogRef);
  private snackBarService = inject(FlSnackBarService);

  inputs: HaAdminSendToDifyDialogInput;
  difyKnowledgeBases$: Observable<HaDifyKnowledgeBase[]> = this.difyService
    .getKnowledgeBaseList()
    .pipe(map((res) => res.data));
  selectedKnowledgeBaseId: string = null;
  isLoading: boolean;
  separator: string = '\\n\\n';
  maxTokens: number = 500;
  indexingTechnique: 'high_quality' | 'economy' = 'high_quality';

  constructor() {
    this.inputs = inject<HaAdminSendToDifyDialogInput>(MAT_DIALOG_DATA);
  }

  sendToKnowledgeBase(): void {
    this.isLoading = true;
    this.difyService
      .createDocuments(this.selectedKnowledgeBaseId, this.inputs.entityType, this.inputs.entityId, {
        separator: this.separator,
        maxTokens: this.maxTokens,
        indexingTechnique: this.indexingTechnique,
      })
      .subscribe((res) => {
        if (res) {
          this.isLoading = false;
          this.snackBarService.openSuccessMessage({ text: 'brick_docs_sent_to_dify', translateText: true });
          this.dialogRef.close();
        } else {
          this.snackBarService.openErrorMessage({
            text: 'error_while_sending_brick_docs_to_dify',
            translateText: true,
          });
        }
      });
  }
}
