import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {Line} from 'd3';
import {FlD3SelectionSimple, FlD3ZoomEvent} from '@monorepo/front-core-lib';
import {ClHelpService} from '@monorepo/core-lib';

interface Coord {
  x: number;
  y: number;
}

@Component({
  selector: 'gen-flow-test',
  templateUrl: './flow-test.component.html',
  styleUrls: ['./flow-test.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class FlowTestComponent implements OnInit {

  @ViewChild('container', {static: true}) container: ElementRef<HTMLElement>;
  @ViewChild('flow', {static: true}) flow: ElementRef<HTMLElement>;

  drawing: boolean = false;

  containerSelection: FlD3SelectionSimple<void>;
  svg: FlD3SelectionSimple;
  path: FlD3SelectionSimple;

  startCoord: Coord;

  lineCreator: Line<Coord>;

  shift: number = 30;

  constructor() {
  }

  ngOnInit(): void {
    this.lineCreator = d3.line((coord: Coord) => coord.x, (coord: Coord) => coord.y)
      .curve(d3.curveCatmullRom.alpha(1));

    this.containerSelection = d3.select(this.flow.nativeElement);

    this.enableZoom();
  }


  mouseDown(event: MouseEvent): void {
    console.log('Ev');
    if (event.button !== 2) {
      return;
    }

    this.drawing = true;

    this.svg = this.containerSelection.append('svg');
    this.startCoord = this.getRelativeMouseCoord(event);

    this.path = this.svg.append('path')

      .attr('d', this.lineCreator([this.startCoord, this.startCoord]));
  }


  onMouseUp(event: MouseEvent): void {
    const target: HTMLElement = event.target as any;
    if (target.classList.contains('port')) {
      this.savePath();
    } else {
      this.cancelPath();
    }
  }

  cancelPath(): void {
    if (this.drawing) {

      this.drawing = false;

      this.path.remove();
      this.path = null;
    }
  }

  savePath(): void {

    if (this.drawing) {
      this.drawing = false;
      this.path = null;
    }
  }

  mouseMove(event: MouseEvent): void {
    if (this.drawing) {

      const endCoord: Coord = this.getRelativeMouseCoord(event);
      endCoord.x--;

      const second: Coord = {x: this.startCoord.x + this.shift, y: this.startCoord.y};
      const third: Coord = {x: endCoord.x - this.shift, y: endCoord.y};

      this.path.attr('d', this.lineCreator([this.startCoord, second, third, endCoord]));
    }
  }

  private getRelativeMouseCoord(event: MouseEvent): Coord {
    const rect = this.flow.nativeElement.getBoundingClientRect();
    return {
      x: event.x - rect.x,
      y: event.y - rect.y
    };
  }

  private enableZoom(): void {
    //add zoom capabilities
    const zoom_handler = d3.zoom()
      .on('zoom', (event) => this.zoom_actions(event));

    zoom_handler(d3.select(this.container.nativeElement));
  }

  //Zoom functions
  private zoom_actions(event: FlD3ZoomEvent): void {
    const transform: string = `translate(${event.transform.x}px, ${event.transform.y}px) scale(${event.transform.k})`;
    this.containerSelection.style('transform', transform);
  }

  disableContextMenu(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
  }

}
