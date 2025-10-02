import { Component, Directive, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

import { FlVideoHelper } from '../../helper/fl-video-helper';

interface FlVideoFullscreenDialogInput {
  url: string;
  title?: string;
}

/**
 * Directive to be placed on a video element to allow the user to open the video in fullscreen
 */
@Directive({
  selector: '[flVideoFullscreen]',
  standalone: false,
})
export class FlVideoFullscreenDirective {
  private dialogService = inject(FlDialogService);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  constructor() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'pointer');
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.stopPropagation();

    const url = this.elementRef.nativeElement.getAttribute('data-video-url');
    if (!url) return;

    const input: FlVideoFullscreenDialogInput = {
      url,
      title: this.elementRef.nativeElement.getAttribute('data-video-title') || 'Video',
    };

    this.dialogService.openFullDialog(FlVideoFullscreenComponent, {
      data: input,
      panelClass: ['g-dialog-no-padding', 'g-dialog-no-border-radius', 'g-dialog-transparent'],
      autoFocus: false,
    });
  }
}

/**
 * Component to show the video in fullscreen dialog
 */
@Component({
  template: `
    <div class="container g-layout-row g-layout-center-center">
      <button mat-mini-fab matDialogClose class="close-button g-button-shadow primary">
        <mat-icon>close</mat-icon>
      </button>
      <div class="video-container" (flOutsideClick)="closeDialog()">
        <iframe
          [src]="embedUrl"
          [title]="title"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write;
           encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        height: 100%;
        width: 100%;
        position: absolute;
      }

      .close-button {
        position: absolute;
        top: 0.5em;
        right: 0.5em;
        z-index: 1;
      }

      .video-container {
        width: 90%;
        max-width: 1200px;
        aspect-ratio: 16 / 9;
        position: relative;
      }

      iframe {
        width: 100%;
        height: 100%;
        border-radius: 8px;
      }

      @media (max-width: 768px) {
        .video-container {
          width: 95%;
        }
      }
    `,
  ],
  standalone: false,
})
export class FlVideoFullscreenComponent {
  private dialogRef = inject<MatDialogRef<FlVideoFullscreenComponent>>(MatDialogRef);
  private sanitizer = inject(DomSanitizer);

  url: string;
  title: string;
  embedUrl: SafeResourceUrl;

  constructor() {
    const input = inject<FlVideoFullscreenDialogInput>(MAT_DIALOG_DATA);

    this.url = input.url;
    this.title = input.title || 'Video';
    this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getEmbedUrl(input.url));
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  private getEmbedUrl(url: string): string {
    const videoId = FlVideoHelper.extractYoutubeVideoId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return url;
  }

  private extractYoutubeVideoId(url: string): string | null {
    return FlVideoHelper.extractYoutubeVideoId(url);
  }
}
