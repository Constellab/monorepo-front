import { Component, DoCheck, ElementRef, signal, Signal, ViewChild, WritableSignal } from '@angular/core';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import { LabResourceDetailState } from '../../state/lab-resource-detail.state';

/**
 * Component in the resource detail to show the list of children resources (if ResourceSet)
 * as tabs in the top of the page
 */
@Component({
    selector: 'lab-resource-children-tabs',
    templateUrl: './lab-resource-children-tabs.component.html',
    styleUrls: ['./lab-resource-children-tabs.component.scss'],
    standalone: false
})
export class LabResourceChildrenTabsComponent implements DoCheck {
  @ViewChild('scrollableElement', { static: true }) scrollableElement: ElementRef<HTMLElement>;

  resource: Signal<LabResource> = this.state.mainResource;

  children: Signal<LabResource[]> = this.state.childrenResources;

  selectedResource: Signal<LabResource> = this.state.selectedResource;

  showLeftScrollButton: WritableSignal<boolean> = signal(false);
  showRightScrollButton: WritableSignal<boolean> = signal(false);

  constructor(private state: LabResourceDetailState) {}

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
