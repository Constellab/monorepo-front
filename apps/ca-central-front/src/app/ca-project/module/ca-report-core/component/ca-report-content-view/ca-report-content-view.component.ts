import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RvResourceView } from '@monorepo/resource-view';
import { TeElementBlockDirective } from '@monorepo/text-editor';
import { CaReportService } from '../../../../../ca-core/service-api/ca-report.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ca-report-content-view',
  templateUrl: './ca-report-content-view.component.html',
  styleUrls: ['./ca-report-content-view.component.scss']
})
export class CaReportContentViewComponent extends TeElementBlockDirective {

  view$: Observable<RvResourceView>;

  resourceId: string;
  viewTitle: string;
  caption: string;

  constructor(private reportService: CaReportService) {
    super();
  }

  public setViewInputs(reportId: string, viewId: string,
                       title: string, caption: string, resourceId?: string): void {
    this.view$ = this.reportService.getView(reportId, viewId).pipe(
      map(reportView => reportView.view)
    );

    this.viewTitle = title;
    this.caption = caption;
    this.resourceId = resourceId;
  }

}
