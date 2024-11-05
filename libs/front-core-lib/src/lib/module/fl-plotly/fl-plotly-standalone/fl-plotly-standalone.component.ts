import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// Plotly.newPlot()
// we use the strict version of plotly even if it's not typed because the normal version
// use eval (for webgl scatter) which requires unsafe-eval in the CSP
// don't use the dist version because the webgl doesn't work in production mode
// eslint-disable-next-line @typescript-eslint/no-var-requires
import Plotly from 'plotly.js-strict-dist';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { FlPlotlyData, FlResizeObservable } from '@monorepo/front-core-lib';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'fl-plotly-standalone',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fl-plotly-standalone.component.html',
  styleUrl: './fl-plotly-standalone.component.scss',
})
export class FlPlotlyStandaloneComponent implements OnInit, OnDestroy {
  @Input({ required: true }) data: FlPlotlyData;

  @Input() autoResize: boolean = true;

  @ViewChild('plotlyContainer', { static: true })
  plotlyContainer: ElementRef<HTMLElement>;

  private resizeObs?: FlResizeObservable;

  ngOnInit(): void {
    Plotly.newPlot(this.plotlyContainer.nativeElement, this.data.data, this.data.layout);

    if (this.autoResize) {
      this.resizeObs = new FlResizeObservable(this.plotlyContainer.nativeElement);

      // resize the plotly container when the component is resized
      this.resizeObs
        .getObs()
        .pipe(debounceTime(250))
        .subscribe((value) => {
          if (value.length === 0) return;
          const resize = value[0];
          Plotly.relayout(this.plotlyContainer.nativeElement, {
            width: resize.contentRect.width,
            height: resize.contentRect.height,
          });
        });
    }
  }

  ngOnDestroy(): void {
    this.resizeObs?.disconnect();
  }
}
