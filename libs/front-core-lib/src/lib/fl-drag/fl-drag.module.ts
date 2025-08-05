import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlDragHoverDirective } from './fl-drag-hover/fl-drag-hover.directive';
import { FlDraggableDirective } from './fl-draggable/fl-draggable.directive';

@NgModule({
  declarations: [FlDraggableDirective, FlDragHoverDirective],
  exports: [FlDraggableDirective, FlDragHoverDirective],
  imports: [CommonModule],
})
export class FlDragModule {}
