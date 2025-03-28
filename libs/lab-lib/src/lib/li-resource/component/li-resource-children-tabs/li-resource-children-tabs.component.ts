import {
  Component,
  DoCheck,
  ElementRef,
  Signal,
  ViewChild,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { LiResource } from '@monorepo/lab-lib/li-core';
import { LiResourceDetailState } from '../../state/li-resource-detail.state';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';

/**
 * Component in the resource detail to show the list of children resources (if ResourceSet)
 * as tabs in the top of the page
 */
@Component({
  selector: 'li-resource-children-tabs',
  templateUrl: './li-resource-children-tabs.component.html',
  styleUrls: ['./li-resource-children-tabs.component.scss'],
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
