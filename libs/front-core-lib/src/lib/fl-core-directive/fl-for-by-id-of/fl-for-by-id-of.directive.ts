import {
  Directive,
  Input,
  IterableDiffers,
  NgIterable,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { NgForOf, NgForOfContext } from '@angular/common';
import { ClHelpService } from '@monorepo/core-lib';

interface WithId {
  id: any;
}

/**
 * Directive that extends NgForOf to automatically set the trackBy
 * to track by ids
 */
@Directive({
  selector: '[flForById]',
  standalone: false,
})
export class FlForByIdOfDirective<T extends WithId, U extends NgIterable<T> = NgIterable<T>> extends NgForOf<
  T,
  U
> {
  constructor() {
    const _viewContainer = inject(ViewContainerRef);
    const _template = inject<TemplateRef<NgForOfContext<T, U>>>(TemplateRef);
    const _differs = inject(IterableDiffers);

    super(_viewContainer, _template, _differs);
    // set the track by id
    this.ngForTrackBy = ClHelpService.trackByIdFunction();
  }

  @Input({ required: false }) set ngForOf(ngForOf: (U & NgIterable<T>) | undefined | null) {
    super.ngForOf = ngForOf;
  }

  @Input()
  set flForByIdOf(ngForOf: (U & NgIterable<T>) | undefined | null) {
    this.ngForOf = ngForOf;
  }
}
