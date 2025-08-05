import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';

import { FlDragManagerService } from '../fl-drag-manager.service';

@Directive({
  selector: '[flDraggable]',
  standalone: false,
})
export class FlDraggableDirective implements OnInit {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private dragManager = inject(FlDragManagerService);

  /**
   * Type of the data to drag. Useful to distinguish different drag object
   * to activate drop or not based on type
   */
  @Input() flDraggableType: string;

  /**
   * Data to pass to drag event (must support stringify)
   */
  @Input() flDraggableData: any;

  /**
   * Element to use as ghost when dragging
   */
  @Input() flDraggableGhostElement: HTMLElement;

  @Output() flDragStart: EventEmitter<DragEvent> = new EventEmitter();

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent): void {
    this.dragManager.setDraggedData(this.flDraggableType, this.flDraggableData);

    this.flDragStart.emit(event);

    if (this.flDraggableGhostElement) {
      event.dataTransfer.setDragImage(this.flDraggableGhostElement, 0, 0);
    }
  }

  ngOnInit(): void {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'draggable', 'true');

    if (!this.flDraggableType) {
      console.error('[flDraggable] flDraggableKey is required');
    }
  }
}
