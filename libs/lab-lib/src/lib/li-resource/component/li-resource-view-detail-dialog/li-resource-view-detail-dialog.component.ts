import { Component, inject,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiResourceService, LiResourceView } from '@monorepo/lab-lib/li-core';
import { TdParamSpecsValues } from '@monorepo/technical-doc';
import { Observable } from 'rxjs';

import { LiResourceViewDetailComponent } from '../li-resource-view-detail/li-resource-view-detail.component';

export type LiResourceViewDetailDialogInput =
  | {
      mode: 'defaultView';
      resourceId: string;
      resourceName: string;
      saveViewConfig: boolean;
    }
  | {
      mode: 'view';
      resourceId: string;
      resourceName: string;
      viewMethodName: string;
      saveViewConfig: boolean;
      config: TdParamSpecsValues;
    };

@Component({
  selector: 'li-resource-view-detail-dialog',
  templateUrl: './li-resource-view-detail-dialog.component.html',
  styleUrls: ['./li-resource-view-detail-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, FlSectionModule, LiResourceViewDetailComponent],
})
export class LiResourceViewDetailDialogComponent implements OnInit {
  private input = inject<LiResourceViewDetailDialogInput>(MAT_DIALOG_DATA);
  private resourceService = inject(LiResourceService);

  title: string;

  labView$: Observable<LiResourceView>;

  constructor() {
    const input = this.input;

    this.title = input.resourceName;
  }

  ngOnInit(): void {
    if (this.input.mode === 'defaultView') {
      this.labView$ = this.resourceService.callResourceDefaultView(
        this.input.resourceId,
        this.input.saveViewConfig
      );
    } else {
      this.labView$ = this.resourceService.callResourceView(
        this.input.resourceId,
        this.input.viewMethodName,
        this.input.config,
        this.input.saveViewConfig
      );
    }
  }
}
