import {Component, Input} from '@angular/core';
import {CaServerInfo} from '../../../../model/entities/ca-server-info.class';

@Component({
  selector: 'ca-server-info-detail',
  templateUrl: './ca-server-info-detail.component.html',
  styleUrls: ['./ca-server-info-detail.component.scss']
})
export class CaServerInfoDetailComponent {

  @Input({required: true}) serverInfo: CaServerInfo;
}
