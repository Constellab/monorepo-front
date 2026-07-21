import { AfterViewInit, ChangeDetectionStrategy,Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlImageModule } from '@monorepo/front-core-lib/fl-image';
import { FlVideoHelper, FlVideoModule } from '@monorepo/front-core-lib/fl-video';

import { HaCommunityAppService } from '../../../ha-core/ha-service/ha-community-app.service';
import { HaCommunityAppState } from '../../state/ha-community-app.state';

interface HaCommunityAppCarouselItem {
  type: 'video' | 'image';
  url: string;
  thumbnail?: string;
}

@Component({
  selector: 'ha-community-app-carousel',
  templateUrl: './ha-community-app-carousel.component.html',
  styleUrl: './ha-community-app-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIconButton, MatIcon, FlImageModule, FlVideoModule],
})
export class HaCommunityAppCarouselComponent implements AfterViewInit {
  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef<HTMLDivElement>;

  private communityAppState = inject(HaCommunityAppState);
  private communityAppService = inject(HaCommunityAppService);

  app = this.communityAppState.app;

  private currentIndex = signal(0);
  private gap = 20; // Gap between elements, synced with CSS

  video = computed(() => {
    const app = this.app();
    if (!app) return null;
    return app.video || null;
  });

  images = computed(() => {
    const app = this.app();
    if (!app || !app.figures) return [];

    return app.figures.map((figure) => this.communityAppService.getAppPictureUrl(figure));
  });

  // Combine video and images in a single array
  carouselItems = computed(() => {
    const items: HaCommunityAppCarouselItem[] = [];

    // Add video first if it exists
    const videoUrl = this.video();
    if (videoUrl) {
      items.push({
        type: 'video',
        url: videoUrl,
        thumbnail: this.getYoutubeThumbnail(videoUrl),
      });
    }

    // Add images
    this.images().forEach((imageUrl) => {
      items.push({
        type: 'image',
        url: imageUrl,
      });
    });

    return items;
  });

  ngAfterViewInit(): void {
    // No need to calculate dimensions, handled by CSS
    setTimeout(() => this.updateCarouselPosition(), 100);
  }

  leftButtonClick(): void {
    const items = this.carouselItems();
    if (items.length === 0) return;

    let newIndex = this.currentIndex() - 1;

    // Infinite effect: if going before first, go to last
    if (newIndex < 0) {
      newIndex = items.length - 1;
    }

    this.currentIndex.set(newIndex);
    this.updateCarouselPosition();
  }

  rightButtonClick(): void {
    const items = this.carouselItems();
    if (items.length === 0) return;

    let newIndex = this.currentIndex() + 1;

    // Infinite effect: if going past last, return to first
    if (newIndex >= items.length) {
      newIndex = 0;
    }

    this.currentIndex.set(newIndex);
    this.updateCarouselPosition();
  }

  private updateCarouselPosition(): void {
    if (!this.carouselContainer) return;

    const items = this.carouselItems();
    if (items.length === 0) return;

    // Get actual element width calculated by CSS
    const firstItem = this.carouselContainer.nativeElement.querySelector('.carousel-item') as HTMLElement;
    if (!firstItem) return;

    const itemWidth = firstItem.offsetWidth;
    const itemTotalWidth = itemWidth + this.gap;

    // Left alignment instead of centering
    const translateX = -(this.currentIndex() * itemTotalWidth);

    this.carouselContainer.nativeElement.style.transform = `translateX(${translateX}px)`;
  }

  private getYoutubeThumbnail(url: string): string {
    return FlVideoHelper.getYoutubeThumbnail(url);
  }
}
