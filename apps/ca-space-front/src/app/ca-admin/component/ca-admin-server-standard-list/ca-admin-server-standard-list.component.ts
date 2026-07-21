import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaServerStandardFormDialogComponent,
  CaServerStandardFormDialogInput,
} from '../../../ca-core/entity-module/ca-server-core/component/ca-server-standard-form-dialog/ca-server-standard-form-dialog.component';
import { CaServerStandardTableComponent } from '../../../ca-core/entity-module/ca-server-core/component/ca-server-standard-table/ca-server-standard-table.component';
import {
  CaServerStandard,
  CaServerStandardDatasource,
} from '../../../ca-core/model/entities/server/ca-server-standard.class';
import { CaServerService } from '../../../ca-core/service-api/ca-server.service';
import { CaSettingsService } from '../../../ca-core/service-api/ca-settings.service';

@Component({
  selector: 'ca-admin-server-standard-list',
  templateUrl: './ca-admin-server-standard-list.component.html',
  styleUrl: './ca-admin-server-standard-list.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    FlInputFileModule,
    FlInfiniteScrollModule,
    CaServerStandardTableComponent,
    TranslatePipe,
  ],
})
export class CaAdminServerStandardListComponent {
  private serverService = inject(CaServerService);
  private dialogService = inject(FlDialogService);
  private settingsService = inject(CaSettingsService);
  private snackBarService = inject(FlSnackBarService);

  serverStandards: CaServerStandardDatasource = this.serverService.findAllServerStandardDatasource();

  openCreateDialog(): void {
    const input: CaServerStandardFormDialogInput = { mode: 'create' };
    this.dialogService
      .openSmallDialog(CaServerStandardFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((serverStandard: CaServerStandard) => this.onCreateClosed(serverStandard));
  }

  private onCreateClosed(serverStandard?: CaServerStandard): void {
    if (serverStandard) {
      this.serverStandards.addItem(serverStandard);
    }
  }

  downloadDecisionTree(): void {
    this.settingsService.getDecisionTree().subscribe((blob) => {
      FlFileHelper.downloadJsonFile(blob, 'decision-tree.json');
    });
  }

  uploadDecisionTree(file: File): void {
    this.settingsService.uploadDecisionTree(file).subscribe(() => this.uploadDecisionTreeSuccess());
  }

  private uploadDecisionTreeSuccess(): void {
    this.snackBarService.openSuccessMessage({ text: 'server_decision_tree_uploaded', translateText: true });
  }
}
