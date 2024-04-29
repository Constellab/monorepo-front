import {Component, ElementRef, OnInit} from '@angular/core';
import {FlThemeService} from '../../../fl-theme/fl-theme.service';
import {FlOverlayRef} from '../../../fl-portal/model/fl-overlay-ref.class';

@Component({
  selector: 'fl-emoji-picker-portal',
  templateUrl: './fl-emoji-picker-portal.component.html',
  styleUrls: ['./fl-emoji-picker-portal.component.scss']
})
export class FlEmojiPickerPortalComponent implements OnInit {

  constructor(private themeService: FlThemeService,
              private elementRef: ElementRef,
              private overlayRef: FlOverlayRef) {

  }

  ngOnInit(): void {
    const divScroll: HTMLElement = this.elementRef.nativeElement.querySelector('.emoji-mart-scroll');
    divScroll.classList.add('g-scrollable-element');
    const emojiMart: HTMLElement = this.elementRef.nativeElement.querySelector('emoji-mart');
    emojiMart.style.border = 'none';
  }

  isDarkTheme(): boolean {
    return this.themeService.isDarkTheme()
  }

  addEmoji(event: any): void {
    this.overlayRef.dispose(event.emoji.native);
  }
}
