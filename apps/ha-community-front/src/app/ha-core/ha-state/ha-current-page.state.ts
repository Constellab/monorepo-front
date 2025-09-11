import { computed, inject, Injectable, OnDestroy, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { HaEntityType } from '../ha-model/ha-entities/ha-entity-type';

@Injectable()
export class HaCurrentPageState implements OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  private currentPageSubscription: Subscription;

  private urls: WritableSignal<UrlSegment[]> = signal<UrlSegment[]>([]);

  public currentEntityType: Signal<HaEntityType> = computed(() => {
    const urlSegments = this.urls();
    if (urlSegments?.length == 0) return null;
    const firstSegment = urlSegments[0].path;
    switch (firstSegment) {
      case 'stories':
        return HaEntityType.STORY;
      case 'bricks':
        return HaEntityType.BRICK;
      case 'apps':
        return HaEntityType.APP;
      case 'agents':
        return HaEntityType.AGENT;
      default:
        return null;
    }
  });

  public getUrls(): Signal<UrlSegment[]> {
    return this.urls;
  }

  public init(): void {
    this.updateUrlSegments();

    this.currentPageSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateUrlSegments();
      });
  }

  private updateUrlSegments(): void {
    let route = this.activatedRoute;

    while (route.parent) {
      route = route.parent;
    }

    const urlSegments: UrlSegment[] = [];
    this.collectUrlSegments(route, urlSegments);

    this.urls.set(urlSegments);
  }

  private collectUrlSegments(route: ActivatedRoute, segments: UrlSegment[]): void {
    segments.push(...route.snapshot.url);

    route.children.forEach((childRoute) => {
      this.collectUrlSegments(childRoute, segments);
    });
  }

  ngOnDestroy(): void {
    this.currentPageSubscription?.unsubscribe();
  }
}
