import { Component, OnInit, inject } from '@angular/core';
import { FL_PORTAL_DATA } from '../../model/fl-portal.class';

/**
 * Simple tooltip component that reuse material classes
 */
@Component({
  selector: 'fl-tooltip',
  templateUrl: './fl-tooltip.component.html',
  styleUrls: ['./fl-tooltip.component.scss'],
  standalone: false,
})
export class FlTooltipComponent implements OnInit {
  message: string;

  constructor() {
    const message = inject(FL_PORTAL_DATA);

    this.message = message;
  }

  ngOnInit(): void {}
}
