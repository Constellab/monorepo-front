import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ch-chart-serie-inline',
  templateUrl: './ch-chart-serie-inline.component.html',
  styleUrls: ['./ch-chart-serie-inline.component.scss']
})
export class ChChartSerieInlineComponent implements OnInit {

  @Input() serieName: string;

  @Input() color: string;

  @Input() limitSerieNameWidth: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
