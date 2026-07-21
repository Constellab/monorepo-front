import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaLabCodelabDTO } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';

/**
 * Dialog to show information about the codelab of a lab
 */
@Component({
  selector: 'ca-lab-codelab-info',
  templateUrl: './ca-lab-codelab-info.component.html',
  styleUrls: ['./ca-lab-codelab-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    FlSectionModule,
    FlKeyValueModule,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    TranslatePipe,
    FlCoreComponentModule,
  ],
})
export class CaLabCodelabInfoComponent implements OnInit {
  private labId: string = inject(MAT_DIALOG_DATA);
  private labService = inject(CaLabService);
  private communityHelper = inject(CoCommunityHelperService);

  codelabInfo$: Observable<CaLabCodelabDTO>;

  communityHelpUrl: string;

  ngOnInit(): void {
    this.communityHelpUrl = this.communityHelper.getDevEnvironmentUrl();
    this.codelabInfo$ = this.labService.findCodelabInfo(this.labId);
  }
}
