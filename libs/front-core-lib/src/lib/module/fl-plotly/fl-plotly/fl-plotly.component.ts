import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';

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


  async ngOnInit(): Promise<void>{

    import('plotly.js-strict-dist').then((module) => {
      module.newPlot(
        this.plotlyContainer.nativeElement,
        this.data.data,
        this.data.layout,
        {

        }
      );
    });
  }
}
