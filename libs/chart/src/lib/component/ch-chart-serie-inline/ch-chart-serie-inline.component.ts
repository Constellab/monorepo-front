import { ChangeDetectionStrategy,Component, Input } from '@angular/core';

@Component({
  selector: 'ch-chart-serie-inline',
  templateUrl: './ch-chart-serie-inline.component.html',
  styleUrls: ['./ch-chart-serie-inline.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ChChartSerieInlineComponent {
  @Input() serieName: string;

  @Input() color: string;

  @Input() limitSerieNameWidth: boolean = false;
}
