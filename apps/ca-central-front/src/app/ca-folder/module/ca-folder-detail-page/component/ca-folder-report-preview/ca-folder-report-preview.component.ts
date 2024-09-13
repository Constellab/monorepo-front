import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CaReport } from '../../../../../ca-core/model/entities/folder/ca-report.class';
import { CaReportService } from '../../../../../ca-core/service-api/ca-report.service';

/**
 * Component in the folder page right panel to show the preview of the report
 */
@Component({
  selector: 'ca-folder-report-preview',
  templateUrl: './ca-folder-report-preview.component.html',
  styleUrls: ['./ca-folder-report-preview.component.scss']
})
export class CaFolderReportPreviewComponent implements OnInit {

  @Input() reportId: string;

  report$: Observable<CaReport>;

  constructor(private reportService: CaReportService) {
  }

  ngOnInit(): void {
    this.report$ = this.reportService.getById(this.reportId);
  }

}
