import {Component, Input, OnInit} from '@angular/core';
import {CaServerInfoService} from '../../../../service-api/ca-server-info.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'ca-server-info-price',
  templateUrl: './ca-server-info-price.component.html',
  styleUrl: './ca-server-info-price.component.scss'
})
export class CaServerInfoPriceComponent implements OnInit {

  @Input({required: true}) serverInfoId: string;

  price$: Observable<number>;

  constructor(private serverInfoService: CaServerInfoService) {
  }

  ngOnInit(): void {
    this.price$ = this.serverInfoService.getServerPrice(this.serverInfoId);
  }


}
