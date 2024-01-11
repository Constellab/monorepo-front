/* eslint-disable @nx/enforce-module-boundaries */
import {Component, ElementRef, OnDestroy, OnInit, ViewChild,} from '@angular/core';
import {RvResourceViewDirective, RvResourceViewPlotly,} from '@monorepo/resource-view';
import {FlResizeObservable} from '@monorepo/front-core-lib';
import {debounceTime} from 'rxjs/operators';
import {CommonModule} from '@angular/common';

// Plotly.newPlot()
// we use the strict version of plotly even if it's not typed because the normal version
// use eval (for webgl scatter) which requires unsafe-eval in the CSP
// don't use the dist version because the webgl doesn't work in production mode
// eslint-disable-next-line @typescript-eslint/no-var-requires
import Plotly from 'plotly.js-strict-dist';


/**
 * Standalone component to display a plotly view.
 * Use standalone to have it own bundle that is only loaded when needed because
 * plotly is a big library.
 */
@Component({
  selector: 'rv-view-plotly',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rv-view-plotly.component.html',
  styleUrls: ['./rv-view-plotly.component.scss'],
})
export class RvViewPlotlyComponent
  extends RvResourceViewDirective<RvResourceViewPlotly>
  implements OnInit, OnDestroy {
  @ViewChild('plotlyContainer', {static: true})
  plotlyContainer: ElementRef<HTMLElement>;

  private resizeObs: FlResizeObservable;

  ngOnInit(): void {
    // (this.view.data.layout as any).updatemenus = [{
    //   y: 0.8,
    //   yanchor: 'top',
    //   buttons: [{
    //     method: 'restyle',
    //     args: ['line.color', 'red'],
    //     label: 'red'
    //   }, {
    //     method: 'restyle',
    //     args: ['line.color', 'blue'],
    //     label: 'blue'
    //   }, {
    //     method: 'restyle',
    //     args: ['line.color', 'green'],
    //     label: 'green'
    //   }]
    // }];
    Plotly.newPlot(
      this.plotlyContainer.nativeElement,
      this.view.data.data,
      this.view.data.layout
    );

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

  ngOnDestroy(): void {
    this.resizeObs?.disconnect();
  }
}
