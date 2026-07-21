import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaHierarchyObjectToken,
  CaHierarchyObjectTokenDatasource,
} from '../../../../model/entities/folder/ca-hierarchy-object-token.class';
import { CaHierarchyObjectTokenService } from '../../../../service-api/ca-hierarchy-object-token.service';
import {
  CaHierarchyObjectTokenFormDialogComponent,
  CaHierarchyObjectTokenFormDialogInput,
} from '../ca-hierarchy-object-token-form-dialog/ca-hierarchy-object-token-form-dialog.component';
import { CaHierarchyObjectTokenTableComponent } from '../ca-hierarchy-object-token-table/ca-hierarchy-object-token-table.component';

export interface CaHierarchyObjectTokenDialogInput {
  hierarchyObjectId: string;
}

/**
 * Dialog to list and manage token of a hierarchy object
 */
@Component({
  selector: 'ca-hierarchy-object-tokens-dialog',
  imports: [
    FlDialogModule,
    TranslatePipe,
    FlInfiniteScrollModule,
    CaHierarchyObjectTokenTableComponent,
    MatIconButton,
    MatTooltip,
    MatIcon,
  ],
  templateUrl: './ca-hierarchy-object-tokens-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ca-hierarchy-object-tokens-dialog.component.scss',
})
export class CaHierarchyObjectTokensDialogComponent implements OnInit {
  dialogInput = inject<CaHierarchyObjectTokenDialogInput>(MAT_DIALOG_DATA);

  tokens: CaHierarchyObjectTokenDatasource;

  private hierarchyObjectTokenService = inject(CaHierarchyObjectTokenService);
  private dialogService = inject(FlDialogService);

  ngOnInit(): void {
    this.tokens = new FlEntityPaginatedDatasource(
      (page, size) =>
        this.hierarchyObjectTokenService.findByHierarchyObjectId(
          this.dialogInput.hierarchyObjectId,
          page,
          size
        ),
      20,
      { initFirstPage: true }
    );
  }

  createToken(): void {
    const data: CaHierarchyObjectTokenFormDialogInput = {
      mode: 'create',
      hierarchyObjectId: this.dialogInput.hierarchyObjectId,
    };

    this.dialogService
      .openSmallDialog(CaHierarchyObjectTokenFormDialogComponent, { data })
      .afterClosed()
      .subscribe((token) => this.onCreateTokenClosed(token));
  }

  private onCreateTokenClosed(token?: CaHierarchyObjectToken): void {
    if (token) {
      this.tokens.unshiftItem(token);
    }
  }
}
