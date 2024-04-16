import {AfterViewInit, Directive, ElementRef, Inject, Input, OnDestroy, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router, RoutesRecognized} from '@angular/router';
import {Observable, Subject, Subscription} from 'rxjs';

/**
 * Auto scroll to anchor in element
 */

@Directive({
  selector: '[flAutoScrollToAnchor]'
})
export class FlAutoScrollToAnchorDirective implements AfterViewInit, OnDestroy {

  @Input() hasIsLoaded = false;
  @Input() isLoaded$: Subject<boolean> = null;

  subscriptions: Subscription[] = [];
  fragment: Observable<string>;

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
      if (e instanceof RoutesRecognized && e.url === e.urlAfterRedirects) {
        const anchor: string = e.url.split('#')[1];
        this.scrollToAnchor(anchor);
      }
    }));

    if (this.hasIsLoaded){
      this.isLoaded$.subscribe((loaded) => {
        if (loaded){
          this.scrollToAnchor(this.route.snapshot.fragment);
        }
      })
    }
  }



  private scrollToAnchor(anchor: string): void {
    if (!anchor) return;

    if (anchor.includes('%')) {
      return;
    }

    anchor = anchor.replace(/[^a-zA-Z-]/g, '');

    const children: HTMLElement = this.elementRef.nativeElement.querySelector(`#${anchor}`);


    if(children){
      children.scrollIntoView(true);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if(this.isLoaded$)
      this.isLoaded$.unsubscribe();
  }

}
