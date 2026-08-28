// Pulls the ambient plotly.js-strict-dist declaration into the program of every consumer that
// compiles these sources through the import graph. An ambient `declare module` for an
// untyped package only works in a global .d.ts, so it cannot be expressed as an import.
/* eslint-disable-next-line @typescript-eslint/triple-slash-reference */
/// <reference path="../../../types.d.ts" />
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FlResizeObservable } from '@monorepo/front-core-lib/fl-core';
import { FlPlotlyData } from '@monorepo/front-core-lib/fl-plotly';
// Plotly.newPlot()
// we use the strict version of plotly even if it's not typed because the normal version
// use eval (for webgl scatter) which requires unsafe-eval in the CSP
// don't use the dist version because the webgl doesn't work in production mode
import Plotly from 'plotly.js-strict-dist';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'fl-plotly-standalone',
  imports: [],
  templateUrl: './fl-plotly-standalone.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
