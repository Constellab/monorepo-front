import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CaReportService} from '../../../../../ca-core/service-api/ca-report.service';
import {CaReportTextEditorConfig2} from '../../model/ca-report-text-editor-config.class';
import {OutputData} from '@editorjs/editorjs';

/**
 * Component to show the report content in a disabled text editor
 */
@Component({
  selector: 'ca-report-content',
  templateUrl: './ca-report-content.component.html',
  styleUrls: ['./ca-report-content.component.scss']
})
export class CaReportContentComponent implements OnInit {

  @Input() reportId: string;

  content$: Observable<OutputData>;
  textEditorConfig: CaReportTextEditorConfig2;


  constructor(private reportService: CaReportService) {
  }

  ngOnInit(): void {
    this.content$ = this.reportService.getContent(this.reportId);
    this.textEditorConfig = new CaReportTextEditorConfig2(this.reportService, this.reportId);
  }

}
