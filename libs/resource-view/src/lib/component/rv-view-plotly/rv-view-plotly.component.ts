/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RvResourceViewDirective, RvResourceViewPlotly} from '@monorepo/resource-view';
import {newPlot, relayout} from 'plotly.js-dist-min';
import {FlResizeObservable} from '@monorepo/front-core-lib';
import {debounceTime} from 'rxjs/operators';
import {CommonModule} from '@angular/common';

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
export class RvViewPlotlyComponent extends RvResourceViewDirective<RvResourceViewPlotly>
  implements OnInit, OnDestroy {

  @ViewChild('plotlyContainer', {static: true}) plotlyContainer: ElementRef<HTMLElement>;

  private resizeObs: FlResizeObservable;


  ngOnInit(): void {
    newPlot(this.plotlyContainer.nativeElement, this.view.data.data,
      this.view.data.layout);

    this.resizeObs = new FlResizeObservable(this.plotlyContainer.nativeElement);

    // resize the plotly container when the component is resized
    this.resizeObs.getObs().pipe(
      debounceTime(250),
    ).subscribe(
      (value) => {
        if (value.length === 0) return;
        const resize = value[0];
        relayout(this.plotlyContainer.nativeElement, {
          width: resize.contentRect.width,
          height: resize.contentRect.height,
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.resizeObs?.disconnect();
  }


}
