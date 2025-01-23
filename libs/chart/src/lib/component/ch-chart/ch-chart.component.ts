import {
  Component,
  ComponentRef,
  ElementRef,
  HostListener,
  inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ChChartState } from '../../state/ch-chart.state';
import { ClHelpService } from '@monorepo/core-lib';
import { ChChartConfig } from '../../model/ch-chart-config.class';
import { debounceTime, filter, map } from 'rxjs/operators';
import { ChChartRightSectionDirective } from '../ch-chart-right-section/ch-chart-right-section.directive';
import { FlMenuDynamic, FlMenuDynamicService } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlResizeObservable } from '@monorepo/front-core-lib/fl-core';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';

interface Size {
  width: number;
  height: number;
}

/**
 * Component to show a chart, must be included in the ChChartContainer
 *
 * The ChChartState must be provider by the parent
 */
@Component({
  selector: 'ch-chart',
  templateUrl: './ch-chart.component.html',
  styleUrls: ['./ch-chart.component.scss'],
  providers: [ChChartState],
  standalone: false,
})
export class ChChartComponent implements OnInit, OnDestroy {
  private themeService = inject(FlThemeService);
  private state = inject(ChChartState);
  private menuService = inject(FlMenuDynamicService);
  private ngZone = inject(NgZone);

  @Input() chart: ChChartConfig;

  /**
   * If provided, it appends the item to the context menu
   */
  @Input() contextMenuItems: FlMenuDynamic[];

  @ViewChild('grid', { static: true }) grid: ElementRef;
  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef;

  @ViewChild('viewContainer', { static: true, read: ViewContainerRef }) viewContainer: ViewContainerRef;

  private previousWidth: number;
  private previousHeight: number;

  private resizeObs: FlResizeObservable;

  // padding in the chart container to prevent the svg to overflow
  private chartContainerPadding: number = 10;

  private legendComponentRef: ComponentRef<ChChartRightSectionDirective>;

  @HostListener('contextmenu', ['$event'])
  contextMenu(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.openContextMenu(event);
  }

  ngOnInit(): void {
    // run the whole chart outside angular zone to improve performance
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.initChart(), 0);
    });
    this.renderLegend();
  }

  private initChart(): void {
    const containerSize: Size = this.svgSize;
    // const size = this.chart.getChartRendererSize();
    // set a default width and height
    if (containerSize.width <= 0) {
      containerSize.width = 400;
    }
    if (containerSize.height <= 0) {
      containerSize.height = 400;
    }

    this.state.initData(this.chart);
    this.state.initChart(this.chartContainer.nativeElement, containerSize.width, containerSize.height);

    this.previousWidth = containerSize.width;
    this.previousHeight = containerSize.height;

    this.subscribeToResize();
  }

  // function to subscribe to host resize to redraw the chart
  // listen to the grid size, to prevent multi triggered because of the scrollbar
  private subscribeToResize(): void {
    this.resizeObs = new FlResizeObservable(this.grid.nativeElement);

    this.resizeObs
      .getObs()
      .pipe(
        debounceTime(250),
        map(() => this.svgSize),
        filter((size) => size.width !== this.previousWidth || size.height !== this.previousHeight)
      )
      .subscribe((size) => this.redrawChart(size));
  }

  // clear the svg and rebuild the chart
  private redrawChart(containerSize: Size): void {
    if (containerSize.width <= 0 || containerSize.height <= 0) {
      return;
    }
    console.log('Redraw chart');
    this.state.chartSVG.svg.remove();
    this.state.initChart(this.chartContainer.nativeElement, containerSize.width, containerSize.height);
  }

  private get svgSize(): Size {
    return {
      width: this.chartContainerWidth,
      height: this.chartContainerHeight - this.chartContainerPadding,
    };
  }

  private get chartContainerWidth(): number {
    return this.chartContainer.nativeElement.clientWidth;
  }

  private get chartContainerHeight(): number {
    return this.chartContainer.nativeElement.clientHeight;
  }

  private openContextMenu(mouseEvent: MouseEvent): void {
    const menu: FlMenuDynamic[] = [
      // Export to SVG button
      {
        type: 'button',
        text: { text: 'chChart.export_chart', translateText: true },
        icon: 'file_download',
        onClick: () => this.state.downloadSVG(),
      },
    ];

    if (this.state.zoomBrush) {
      menu.push(
        // Reset zoom
        {
          type: 'button',
          text: { text: 'chChart.reset_zoom', translateText: true },
          icon: 'search',
          onClick: () => this.state.resetZoom(),
        }
      );
    }

    if (this.contextMenuItems?.length > 0) {
      menu.push(...this.contextMenuItems);
    }

    this.menuService.openDynamicMenuAbsolute(menu, mouseEvent);
  }

  private renderLegend(): void {
    const config = this.chart.getRightSectionConfig();

    if (config == null) return;
    this.legendComponentRef = this.viewContainer.createComponent(config.componentType);
    this.legendComponentRef.instance.data = config.data;
  }

  private destroyLegendComponentRef(): void {
    this.legendComponentRef?.destroy();
    this.legendComponentRef = null;
  }

  ngOnDestroy(): void {
    this.resizeObs?.disconnect();
    this.destroyLegendComponentRef();
    this.chart?.destroy();
  }
}
