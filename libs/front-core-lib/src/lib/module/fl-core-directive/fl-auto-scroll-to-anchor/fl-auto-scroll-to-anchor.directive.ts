import {AfterViewInit, Directive, ElementRef, Input, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router, RoutesRecognized} from '@angular/router';
import {Observable, Subscription} from 'rxjs';

/**
 * Auto scroll to anchor in element
 */

@Directive({
  selector: '[flAutoScrollToAnchor]'
})
export class FlAutoScrollToAnchorDirective implements AfterViewInit, OnDestroy {

  @Input() hasIsLoaded = false;
  @Input() isLoaded$: Observable<boolean> = null;

  subscriptions: Subscription[] = [];
  fragment: Observable<string>;
  lastScrolledAnchor: string;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngAfterViewInit(): void {
    this.fragment = this.route.fragment;

    this.subscriptions.push(this.fragment.subscribe(anchor => {
      if (anchor) {
        this.scrollToAnchor(anchor)
      }
    }));

    this.subscriptions.push(this.router.events.subscribe(e => {
      console.log('e', e)
      if (e instanceof RoutesRecognized && e.url === e.urlAfterRedirects) {
        const anchor: string = e.url.split('#')[1];
        this.scrollToAnchor(anchor);
      }
    }));

    if (this.hasIsLoaded){
      this.subscriptions.push(this.isLoaded$.subscribe((loaded) => {
        if (loaded){
          this.scrollToAnchor(this.route.snapshot.fragment);
        }
      }));
    }
  }



  private scrollToAnchor(anchor: string): void {

    if (!anchor) return;

    if (anchor.includes('%')) {
      return;
    }

    anchor = anchor.replace(/[^a-zA-Z-_]/g, '');

    if (this.lastScrolledAnchor === anchor) {
      return;
    }

    const children: HTMLElement = this.elementRef.nativeElement.querySelector(`#${anchor}`);

    if(children){
      children.scrollIntoView(true);
      this.lastScrolledAnchor = anchor;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
