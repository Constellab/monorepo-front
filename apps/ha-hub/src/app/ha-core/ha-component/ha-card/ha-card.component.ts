import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

export enum HaCardBackground {
  card = 'card',
  main = 'main',
  primary = 'primary',
  warn = 'warn',
  accent = 'accent',
}

@Component({
  selector: 'ha-card',
  templateUrl: './ha-card.component.html',
  standalone: true,
  styleUrls: ['./ha-card.component.scss'],
})
export class HaCardComponent implements AfterViewInit {
  @Input() border: boolean = false;

  @Input() background: HaCardBackground | string = HaCardBackground.card;

  @Input() innerCard: boolean = false;

  @ViewChild('card') card: ElementRef;

  // //set host style
  // @HostBinding('style.display') display: string = 'block';
  // @HostBinding('style.width') padding: string = 'auto';

  ngAfterViewInit(): void {
    if (this.innerCard) {
      this.card.nativeElement.classList.remove('card');
      this.card.nativeElement.classList.add('inner-card');
    }

    if (this.border) {
      this.card.nativeElement.classList.add('card-border');
    }

    switch (this.background) {
      case HaCardBackground.card:
        this.card.nativeElement.style.backgroundColor = 'var(--card-background)';
        break;
      case HaCardBackground.main:
        this.card.nativeElement.style.backgroundColor = 'var(--main-background)';
        break;
      case HaCardBackground.primary:
        this.card.nativeElement.style.backgroundColor = 'var(--primary-color)';
        break;
      case HaCardBackground.warn:
        this.card.nativeElement.style.backgroundColor = 'var(--warn-color)';
        break;
      case HaCardBackground.accent:
        this.card.nativeElement.style.backgroundColor = 'var(--accent-color)';
        break;
    }
  }
}
