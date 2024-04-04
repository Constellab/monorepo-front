import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {RvResourceView} from '@monorepo/resource-view';
import {CaReportViewConfig} from '../../model/ca-report-content-view.class';
import {TeElementBlockDirective} from '@monorepo/text-editor';

@Component({
  selector: 'ca-report-content-view',
  templateUrl: './ca-report-content-view.component.html',
  styleUrls: ['./ca-report-content-view.component.scss']
})
export class CaReportContentViewComponent extends TeElementBlockDirective {

  @Input() viewConfig: CaReportViewConfig;

  @Input() view$: Observable<RvResourceView>;

}
