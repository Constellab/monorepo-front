import { Directive, ElementRef, inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Directive similar to routerLinkActive but without the need
 * of a routerLink attribute. It can be applied to an element that is not a link.
 */
@Directive({
  selector: '[flActiveRoute]',
  standalone: false,
})
export class FlActiveRouteDirective implements OnInit, OnDestroy {
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private renderer = inject(Renderer2);
  private router = inject(Router);

  /**
   * The route to check
   */
  @Input() flActiveRoute: string;

  /**
   * The classes to add when the route is active
   */
  @Input() flActiveRouteClasses: string;

  /**
   * Whether to check if the exact route is active or
   * if the current url start with the provided route
   */
  @Input() flActiveRouteExact: boolean = false;

  private subscription: Subscription;

  private isActive: boolean = false;

  ngOnInit(): void {
    // init with the current url
    this.onRouterEvent(this.router.url);
    this.subscription = this.router.events
      .pipe(filter((ev) => ev instanceof NavigationEnd))
      .subscribe((event) => this.onRouterEvent((event as NavigationEnd).urlAfterRedirects));
  }

  private onRouterEvent(url: string): void {
    let isActive: boolean;
    // check whether to activate the classe
    if (this.flActiveRouteExact) {
      isActive = url === this.flActiveRoute;
    } else {
      isActive = url.startsWith(this.flActiveRoute);
    }

    if (isActive !== this.isActive) {
      this.isActive = isActive;
      if (isActive) {
        this.addClasses();
      } else {
        this.removeClasses();
      }
    }
  }

  private addClasses(): void {
    this.renderer.addClass(this.elementRef.nativeElement, this.flActiveRouteClasses);
  }

  private removeClasses(): void {
    this.renderer.removeClass(this.elementRef.nativeElement, this.flActiveRouteClasses);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
