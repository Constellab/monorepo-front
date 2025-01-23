import { OnDestroy, Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Pipe to convert a blob to display and use it in image src
 */
@Pipe({
  name: 'flBlobToSrc',
  standalone: false,
})
export class FlBlobToSrcPipe implements PipeTransform, OnDestroy {
  private sanitizer = inject(DomSanitizer);

  private lastUrl: string;

  transform(blob: Blob): SafeResourceUrl {
    this.revokeLastURL();

    if (blob == null) {
      return '';
    }

    this.lastUrl = URL.createObjectURL(blob);
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.lastUrl);
  }

  ngOnDestroy(): void {
    this.revokeLastURL();
  }

  private revokeLastURL(): void {
    if (this.lastUrl) {
      URL.revokeObjectURL(this.lastUrl);
      this.lastUrl = null;
    }
  }
}
