import { ChangeDetectionStrategy,Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'fl-loading-card',
  templateUrl: './fl-loading-card.component.html',
  styleUrls: ['./fl-loading-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlLoadingCardComponent implements OnInit {
  @Input() numberOfBodyLines: number = 2;

  bodyLines: null[];

  ngOnInit(): void {
    this.bodyLines = Array(this.numberOfBodyLines).fill(null);
  }
}
