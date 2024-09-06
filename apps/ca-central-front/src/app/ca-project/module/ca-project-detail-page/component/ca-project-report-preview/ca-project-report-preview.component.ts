import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CaReport } from '../../../../../ca-core/model/entities/project/ca-report.class';
import { CaReportService } from '../../../../../ca-core/service-api/ca-report.service';

/**
 * Component in the project page right panel to show the preview of the report
 */
@Component({
  selector: 'ca-project-report-preview',
  templateUrl: './ca-project-report-preview.component.html',
  styleUrls: ['./ca-project-report-preview.component.scss']
})
export class CaProjectReportPreviewComponent implements OnInit {

  @Input() reportId: string;

  report$: Observable<CaReport>;

  constructor(private reportService: CaReportService) {
  }

  ngOnInit(): void {
    this.report$ = this.reportService.getById(this.reportId);
  }

}
