import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef,
  inject,
  Signal,
  signal,
  ViewChild,
  WritableSignal} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { LiResource } from '@monorepo/lab-lib/li-core';

import { LiResourceDetailState } from '../../state/li-resource-detail.state';

/**
 * Component in the resource detail to show the list of children resources (if ResourceSet)
 * as tabs in the top of the page
 */
@Component({
  selector: 'li-resource-children-tabs',
  templateUrl: './li-resource-children-tabs.component.html',
  styleUrls: ['./li-resource-children-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatRipple, NgClass, MatTooltip, MatIconButton, MatIcon],
})
export class LiResourceChildrenTabsComponent implements DoCheck {
  private state = inject(LiResourceDetailState);

  @ViewChild('scrollableElement', { static: true }) scrollableElement: ElementRef<HTMLElement>;

  resource: Signal<LiResource> = this.state.mainResource;

  children: Signal<LiResource[]> = this.state.childrenResources;

  selectedResource: Signal<LiResource> = this.state.selectedResource;

  showLeftScrollButton: WritableSignal<boolean> = signal(false);
  showRightScrollButton: WritableSignal<boolean> = signal(false);

  ngDoCheck(): void {
    this.updateShowScrollButtons();
  }

  updateShowScrollButtons(): void {
    this.showLeftScrollButton.set(this.scrollableElement.nativeElement.scrollLeft > 0);
    this.showRightScrollButton.set(
      this.scrollableElement.nativeElement.scrollLeft + this.scrollableElement.nativeElement.offsetWidth + 1 <
        this.scrollableElement.nativeElement.scrollWidth
    );
  }

  selectResource(resource: LiResource): void {
    this.state.selectResource(resource.id);
  }

  scrollToRight(): void {
    this.scrollableElement.nativeElement.scrollLeft += 100;
  }

  scrollToLeft(): void {
    this.scrollableElement.nativeElement.scrollLeft -= 100;
  }
}
