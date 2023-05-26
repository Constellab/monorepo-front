import {Component, OnInit} from '@angular/core';
import {Observable, switchMap} from 'rxjs';
import {LabProtocolTemplate} from '../../../../../lab-core/model/entities/process/lab-protocol-template.entity';
import {ActivatedRoute} from '@angular/router';
import {LabProtocolTemplateService} from '../../../../../lab-core/entity-service/lab-protocol-template.service';

@Component({
  selector: 'lab-protocol-template-detail-page',
  templateUrl: './lab-protocol-template-detail-page.component.html',
  styleUrls: ['./lab-protocol-template-detail-page.component.scss']
})
export class LabProtocolTemplateDetailPageComponent implements OnInit {

  template$: Observable<LabProtocolTemplate>;

  constructor(private route: ActivatedRoute,
              private protocolTemplateService: LabProtocolTemplateService) {
  }

  ngOnInit(): void {
    this.template$ = this.route.params.pipe(
      switchMap(params => this.protocolTemplateService.getProtocolTemplate(params.id))
    );
  }


}
