import {Component, Input, OnInit} from '@angular/core';
import {CaLabServerInfoDTO} from '../../../../ca-core/model/entities/lab/ca-lab.class';
import {Observable} from 'rxjs';
import {CaLabService} from '../../../../ca-core/service-api/ca-lab.service';

@Component({
  selector: 'ca-lab-server-info-card',
  templateUrl: './ca-lab-server-info-card.component.html',
  styleUrls: ['./ca-lab-server-info-card.component.scss']
})
export class CaLabServerInfoCardComponent implements OnInit{

  @Input({required: true}) labId: string;

  serverInfo$: Observable<CaLabServerInfoDTO>;

  constructor(private labService: CaLabService) {
  }

  ngOnInit(): void {
    this.serverInfo$ = this.labService.getLabServerInfo(this.labId);
  }
}
