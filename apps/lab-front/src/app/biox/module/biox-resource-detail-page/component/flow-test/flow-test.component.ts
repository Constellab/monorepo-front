import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {Line} from 'd3';
import {FlD3SelectionSimple, FlD3ZoomEvent} from '@monorepo/front-core-lib';
import {ClHelpService} from '@monorepo/core-lib';
import {DragRef, Point} from '@angular/cdk/drag-drop';

interface Coord {
  x: number;
  y: number;
}

@Component({
  selector: 'gen-flow-test',
  templateUrl: './flow-test.component.html',
  styleUrls: ['./flow-test.component.scss'],
})
export class FlowTestComponent implements OnInit {

  @ViewChild('container', {static: true}) container: ElementRef<HTMLElement>;
  @ViewChild('flow', {static: true}) flow: ElementRef<HTMLElement>;

  drawing: boolean = false;

  private flowSelection: FlD3SelectionSimple<void>;
  private svg: FlD3SelectionSimple;
  private path: FlD3SelectionSimple;

  private startCoord: Coord;
  private startPort: HTMLElement;

  private lineCreator: Line<Coord>;

  private currentScale: number = 1;
  private shift: number = 30;

  private readonly minScale: number = 0.2;
  private readonly maxScale: number = 10;

  constructor() {
  }

  ngOnInit(): void {
    this.lineCreator = d3.line((coord: Coord) => coord.x, (coord: Coord) => coord.y)
      .curve(d3.curveCatmullRom.alpha(1));

    this.flowSelection = d3.select(this.flow.nativeElement);

    this.enableZoom();
  }


  mouseDown(event: MouseEvent): void {
    console.log('Ev');
    if (event.button !== 2) {
      return;
    }

    this.drawing = true;

    this.svg = this.flowSelection.append('svg');
    this.startCoord = this.getPortCoord(event.target as HTMLElement);
    this.startPort = event.target as any;
    console.log(this.startCoord);

    this.path = this.svg.append('path')
      .attr('d', this.lineCreator([this.startCoord, this.startCoord]));

    ClHelpService.stopEventPropagation(event);
  }


  onMouseUp(event: MouseEvent): void {
    const target: HTMLElement = event.target as any;
    if (target.classList.contains('port') && target !== this.startPort) {
      this.savePath();
    } else {
      this.cancelPath();
    }
  }

  cancelPath(): void {
    if (this.drawing) {

      this.drawing = false;

      this.svg.remove();
      this.svg = null;
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
      const target: HTMLElement = event.target as any;

      let endCoord: Coord;
      if (target.classList.contains('port') && target !== this.startPort) {
        // if we are over a port, set the position to port center
        endCoord = this.getPortCoord(target);
      } else {
        endCoord = this.getRelativeMouseCoord(event);
      }

      // add shift positions
      const second: Coord = {x: this.startCoord.x + this.shift, y: this.startCoord.y};
      const third: Coord = {x: endCoord.x - this.shift, y: endCoord.y};

      this.path.attr('d', this.lineCreator([this.startCoord, second, third, endCoord]));
    }
  }

  // return the center cord of a port
  private getPortCoord(port: HTMLElement): Coord {
    const containerRect: DOMRect = this.flow.nativeElement.getBoundingClientRect();
    const portRect: DOMRect = port.getBoundingClientRect();
    console.log(portRect);
    return this.rescaleCoors({
      x: portRect.left + (portRect.width / 2) - containerRect.left,
      y: portRect.top + (portRect.height / 2) - containerRect.top
    });
  }

  private getRelativeMouseCoord(event: MouseEvent): Coord {
    const rect: DOMRect = this.flow.nativeElement.getBoundingClientRect();
    return this.rescaleCoors({
      x: event.x - rect.x,
      y: event.y - rect.y
    });
  }

  // recalculate the coord position based on current scale
  private rescaleCoors(coord: Coord): Coord {
    return {
      x: coord.x / this.currentScale,
      y: coord.y / this.currentScale
    };
  }

  private enableZoom(): void {
    //add zoom capabilities
    const zoom_handler = d3.zoom()
      .on('zoom', (event) => this.zoom_actions(event))
      .extent([[0, 0], [400, 400]]);
    // .scaleExtent([1, 1])
    // .scaleExtent([this.minScale, this.maxScale]);
    // .translateExtent([[0, 0], [11000,11000]]);


    // zoom_handler.translateBy(this.flowSelection, -5000, -5000);
    // zoom_handler.translateTo(this.flowSelection, 5000, 5000);
    // const zoo = zoomTransform(this.flow.nativeElement).translate(-5000, -5000);
    // zoom_handler.transform(this.flowSelection, zoo);
    zoom_handler(d3.select(this.container.nativeElement));
  }

  constrainPosition = (point: Point, dragRef: DragRef): Point => {
    let zoomMoveXDifference = 0;
    let zoomMoveYDifference = 0;
    if (this.currentScale !- 1) {
      zoomMoveXDifference = (this.currentScale) * dragRef.getFreeDragPosition().x;
      zoomMoveYDifference = (this.currentScale) * dragRef.getFreeDragPosition().y;
    }
    return {
      x: point.x + zoomMoveXDifference ,
      y: point.y + zoomMoveYDifference
    };
//     console.log(point);
//     const rect: DOMRect = this.flow.nativeElement.getBoundingClientRect();
//     const point2 = this.rescaleCoors({
//       x: point.x,
//       y: point.y
//     });
//
//     // return {
//     //   x: 0,
//     //   y: 0
//     // };
// return point2;
    // return {
    //   x: point2.x - rect.x,
    //   y: point2.y - rect.y
    // };
    // return point;
    // return {
    //   x: point.x / this.currentScale,
    //   y: point.y / this.currentScale
    // };
  };


  //Zoom functions
  private zoom_actions(event: FlD3ZoomEvent): void {
    console.log(event.transform);
    const k: number = event.transform.k;
    const x: number = event.transform.x;
    const y: number = event.transform.y;

    this.currentScale = k;

    const transform: string = `translate(${x}px, ${y}px) scale(${k})`;
    this.flowSelection.style('transform', transform);
  }

  disableContextMenu(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
  }

}
