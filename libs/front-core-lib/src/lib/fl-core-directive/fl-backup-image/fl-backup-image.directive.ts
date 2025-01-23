import { Directive, ElementRef, HostListener, inject, Input } from '@angular/core';

/**
 * Directive to set a backup image on an image tag if the first image is not found
 */
@Directive({
  selector: 'img[flBackupImage]',
  standalone: false,
})
export class FlBackupImageDirective {
  private elementRef = inject<ElementRef<HTMLImageElement>>(ElementRef);

  @Input() flBackupImage: string;

  @HostListener('error')
  onError(): void {
    if (this.elementRef.nativeElement.src !== this.flBackupImage) {
      this.elementRef.nativeElement.src = this.flBackupImage;
    }
  }
}
