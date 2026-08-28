import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';

/**
 * Loader to be inserted in a button
 * It fits the size of material button
 */
@Component({
  selector: 'fl-button-loader',
  templateUrl: './fl-button-loader.component.html',
  styleUrls: ['./fl-button-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlButtonLoaderComponent implements OnInit, OnDestroy {
  private button = inject(MatButton, { host: true, optional: true });
  private iconButton = inject(MatIconButton, { host: true, optional: true });
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private renderer2 = inject(Renderer2);

  /**
   * Position of the loader in the button
   * If override, the button text is hidden during loading,
   *    the button text need to be wrapped in a span
   *
   *  Default to right in button and override in icon buttons
   */
  @Input() position: 'left' | 'right' | 'override';

  @Input() size: 'normal' | 'small' = 'normal';

  @Input() disabledButtonOnLoad: boolean = true;

  private readonly hideTextClass: string = 'g-button-hide-text';

  ngOnInit(): void {
    if (this.position == null) {
      this.position = this.defaultPosition;
    }

    const button = this.getButton();
    if (button && this.disabledButtonOnLoad) {
      button.disabled = true;
    }

    if (this.position === 'override') {
      this.renderer2.addClass(this.elementRef.nativeElement.parentElement, this.hideTextClass);
    }
  }

  get loaderSize(): number {
    if (this.size === 'small') {
      return 20;
    } else if (this.size === 'normal') {
      return 30;
    } else {
      console.error('[ButtonLoaderComponent] incorrect size');
      return 20;
    }
  }

  // return true if the button is an icon button
  private isIconButton(): boolean {
    return this.iconButton != null;
  }

  // default position
  private get defaultPosition(): 'left' | 'right' | 'override' {
    return this.isIconButton() ? 'override' : 'right';
  }

  private getButton(): MatButton | MatIconButton | null {
    return this.button ?? this.iconButton;
  }

  ngOnDestroy(): void {
    const button = this.getButton();
    if (button) {
      button.disabled = false;
    }

    if (this.position === 'override') {
      this.renderer2.removeClass(this.elementRef.nativeElement.parentElement, this.hideTextClass);
    }
  }
}
