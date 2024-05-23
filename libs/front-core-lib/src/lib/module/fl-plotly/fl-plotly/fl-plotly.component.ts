import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';

// Plotly.newPlot()
// we use the strict version of plotly even if it's not typed because the normal version
// use eval (for webgl scatter) which requires unsafe-eval in the CSP
// don't use the dist version because the webgl doesn't work in production mode
// eslint-disable-next-line @typescript-eslint/no-var-requires
import Plotly from 'plotly.js-strict-dist';

export interface FlPlotlyData {
  data: any;
  layout: any;
}


@Component({
  selector: 'fl-plotly',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fl-plotly.component.html',
  styleUrls: ['./fl-plotly.component.scss']
})
export class FlPlotlyComponent implements OnInit{

  @Input({required: true}) data: FlPlotlyData;

  @ViewChild('plotlyContainer', {static: true})
  plotlyContainer: ElementRef<HTMLElement>;


  ngOnInit(): void{


    Plotly.newPlot(
      this.plotlyContainer.nativeElement,
      this.data.data,
      this.data.layout,
      {

      }
    );
  }
}
