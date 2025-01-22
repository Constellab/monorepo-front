import { Component, OnInit, inject } from '@angular/core';
import { FL_PORTAL_DATA } from '../../../fl-portal/model/fl-portal.class';
import { FlOverlayRef } from '../../../fl-portal/model/fl-overlay-ref.class';

@Component({
  selector: 'fl-color-selector-portal',
  templateUrl: './fl-color-selector-portal.component.html',
  styleUrls: ['./fl-color-selector-portal.component.scss'],
  standalone: false,
})
export class FlColorSelectorPortalComponent implements OnInit {
  private overlayRef = inject(FlOverlayRef);

  color?: string;

  constructor() {
    const color = inject(FL_PORTAL_DATA);

    this.color = color;
  }

  ngOnInit(): void {}

  onColorSelected(color: string): void {
    this.overlayRef.dispose(color);
  }
}
