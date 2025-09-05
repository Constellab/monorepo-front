import { Component, computed, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ha-button',
  templateUrl: './ha-button.component.html',
  styleUrls: ['./ha-button.component.scss'],
  imports: [MatButton, RouterLink],
})
export class HaButtonComponent {
  theme = input<'light' | 'dark'>('light');

  disabled = input<boolean>(false);

  href = input<string | null>(null);

  target = input<string | null>(null);

  routerLink = input<string | any[]>(null);

  type = input<'button' | 'submit' | 'reset'>('button');

  buttonClass = computed(() => {
    const theme = this.theme();
    return theme === 'dark' ? 'button-dark' : 'button-light';
  });

  borderClass = computed(() => {
    const theme = this.theme();
    return theme === 'dark' ? 'border-dark' : 'border-light';
  });

  clicked = output();

  emitClick(): void {
    this.clicked.emit();
  }
}
