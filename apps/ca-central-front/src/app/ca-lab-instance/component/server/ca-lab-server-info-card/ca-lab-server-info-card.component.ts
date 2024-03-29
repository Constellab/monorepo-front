import {Component, Input, OnInit} from '@angular/core';
import {CaLabServerInfoDTO} from '../../../../ca-core/model/entities/lab/ca-lab-instance.class';
import {Observable} from 'rxjs';
import {CaLabInstanceService} from '../../../../ca-core/service-api/ca-lab-instance.service';

@Component({
  selector: 'ca-lab-server-info-card',
  templateUrl: './ca-lab-server-info-card.component.html',
  styleUrls: ['./ca-lab-server-info-card.component.scss']
})
export class CaLabServerInfoCardComponent implements OnInit{

  @Input({required: true}) labInstanceId: string;

  serverInfo$: Observable<CaLabServerInfoDTO>;

  constructor(private labService: CaLabInstanceService) {
  }

  ngOnInit(): void {
    this.serverInfo$ = this.labService.getLabServerInfo(this.labInstanceId);
  }
}
