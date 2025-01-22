import {
  Component,
  DoCheck,
  ElementRef,
  signal,
  Signal,
  ViewChild,
  WritableSignal,
  inject,
} from '@angular/core';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import { LabResourceDetailState } from '../../state/lab-resource-detail.state';
import { MatRipple } from '@angular/material/core';
import { NgClass } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

/**
 * Component in the resource detail to show the list of children resources (if ResourceSet)
 * as tabs in the top of the page
 */
@Component({
  selector: 'lab-resource-children-tabs',
  templateUrl: './lab-resource-children-tabs.component.html',
  styleUrls: ['./lab-resource-children-tabs.component.scss'],
  imports: [MatRipple, NgClass, MatTooltip, MatIconButton, MatIcon],
})
export class LabResourceChildrenTabsComponent implements DoCheck {
  private state = inject(LabResourceDetailState);

  @ViewChild('scrollableElement', { static: true }) scrollableElement: ElementRef<HTMLElement>;

  resource: Signal<LabResource> = this.state.mainResource;

  children: Signal<LabResource[]> = this.state.childrenResources;

  selectedResource: Signal<LabResource> = this.state.selectedResource;

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

  selectResource(resource: LabResource): void {
    this.state.selectResource(resource.id);
  }

  scrollToRight(): void {
    this.scrollableElement.nativeElement.scrollLeft += 100;
  }

  scrollToLeft(): void {
    this.scrollableElement.nativeElement.scrollLeft -= 100;
  }
}
