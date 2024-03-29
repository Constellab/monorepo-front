import {Component, Input, OnInit} from '@angular/core';
import {CaServerService} from '../../../../service-api/ca-server.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'ca-server-standard-price',
  templateUrl: './ca-server-standard-price.component.html',
  styleUrl: './ca-server-standard-price.component.scss'
})
export class CaServerStandardPriceComponent implements OnInit {

  @Input({required: true}) serverStandardId: string;

  price$: Observable<number>;

  constructor(private serverService: CaServerService) {
  }

  ngOnInit(): void {
    this.price$ = this.serverService.getServerPrice(this.serverStandardId);
  }


}
