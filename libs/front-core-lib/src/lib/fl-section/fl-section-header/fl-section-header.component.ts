import { ChangeDetectionStrategy,Component } from '@angular/core';

@Component({
  selector: 'fl-section-header',
  templateUrl: './fl-section-header.component.html',
  styleUrls: ['./fl-section-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlSectionHeaderComponent {}
