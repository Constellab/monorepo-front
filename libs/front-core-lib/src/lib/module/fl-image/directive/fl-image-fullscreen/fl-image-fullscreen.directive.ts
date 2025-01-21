import { Component, Directive, ElementRef, HostListener, Inject, Renderer2 } from '@angular/core';
import { FlDialogService } from '../../../fl-dialog/fl-dialog.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface FlImageFullscreenDialogInput {
  src: string;
  alt?: string;
}

/**
 * Directive to be place on an image to allow the user to open the image in fullscreen
 */
@Directive({
  selector: 'img[flImageFullscreen]',
  standalone: false,
})
export class FlImageFullscreenDirective {
  constructor(
    private dialogService: FlDialogService,
    private elementRef: ElementRef<HTMLImageElement>,
    private renderer: Renderer2
  ) {
    this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'pointer');
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.stopPropagation();

    const src = this.elementRef.nativeElement.src;
    if (!src) return;

    const input: FlImageFullscreenDialogInput = {
      src,
      alt: this.elementRef.nativeElement.alt,
    };

    this.dialogService.openFullDialog(FlImageFullscreenTestComponent, {
      data: input,
      panelClass: ['g-dialog-no-padding', 'g-dialog-no-border-radius', 'g-dialog-transparent'],
      autoFocus: false,
    });
  }
}

/**
 * Component to show the image in fullscreen dialog
 */
@Component({
  template: `
    <div class="container g-layout-row g-layout-center-center">
      <button mat-mini-fab matDialogClose class="close-button g-button-shadow primary">
        <mat-icon>close</mat-icon>
      </button>
      <img [src]="src" [alt]="alt" (flOutsideClick)="closeDialog()" />
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

      img {
        max-width: 100%;
        height: auto;
        max-height: 100%;
      }
    `,
  ],
  standalone: false,
})
export class FlImageFullscreenTestComponent {
  src: string;
  alt: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) input: FlImageFullscreenDialogInput,
    private dialogRef: MatDialogRef<FlImageFullscreenTestComponent>
  ) {
    this.src = input.src;
    this.alt = input.alt;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
