import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized, Scroll } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

/**
 * Auto scroll to anchor in element
 */

@Directive({
  selector: '[flAutoScrollToAnchor]',
  standalone: false,
})
export class FlAutoScrollToAnchorDirective implements AfterViewInit, OnDestroy {
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Observable that emits true when the component using targeted is loaded
  @Input() flAutoScrollIsLoaded$: Observable<boolean> = null;

  // True if the component has a flAutoScrollIsLoaded$ observable
  @Input() flAutoScrollHasIsLoaded = false;

  subscriptions: Subscription[] = [];
  fragment: Observable<string>;
  lastScrolledAnchor: string;

  ngAfterViewInit(): void {
    this.fragment = this.route.fragment;

    // Scroll on fragment change
    this.subscriptions.push(
      this.fragment.subscribe((anchor) => {
        if (anchor) {
          this.scrollToAnchor(anchor);
        }
      })
    );

    this.subscriptions.push(
      this.router.events.subscribe((e) => {
        // Scroll on route change
        if (e instanceof RoutesRecognized && e.url === e.urlAfterRedirects) {
          const anchor: string = e.url.split('#')[1];
          this.scrollToAnchor(anchor);
        }

        // Scroll on scroll event
        if (e instanceof Scroll && e.anchor != null) {
          this.scrollToAnchor(e.anchor);
        }
      })
    );

    // Scroll on load if flAutoScrollIsLoaded$ is provided
    if (this.flAutoScrollHasIsLoaded) {
      this.subscriptions.push(
        this.flAutoScrollIsLoaded$.subscribe((loaded) => {
          if (loaded) {
            this.scrollToAnchor(this.route.snapshot.fragment);
          }
        })
      );
    }
  }

  private scrollToAnchor(anchor: string): void {
    // If the anchor is null or contains %, do not scroll
    if (!anchor) return;
    if (anchor.includes('%')) {
      return;
    }

    // Remove special characters from the anchor

    anchor = anchor.replace(/[^a-zA-Z-_]/g, '');
    // anchor = anchor.replace('_', '');

    // If the anchor is the same as the last one, do not scroll
    if (this.lastScrolledAnchor === anchor) {
      return;
    }

    // Find the element with the anchor
    const children: HTMLElement = this.elementRef.nativeElement.querySelector(`#${anchor}`);

    if (children) {
      // Scroll to the element
      children.scrollIntoView(true);
      this.lastScrolledAnchor = anchor;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
