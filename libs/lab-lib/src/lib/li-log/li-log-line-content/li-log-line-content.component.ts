import { Component, input, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { LiLogLine } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-log-line-content',
  imports: [FlDateModule, MatButton, TranslatePipe],
  templateUrl: './li-log-line-content.component.html',
  styleUrl: './li-log-line-content.component.scss',
})
export class LiLogLineContentComponent {
  line = input.required<LiLogLine>();

  showStackTrace = signal(false);

  toggleStackTrace(): void {
    this.showStackTrace.set(!this.showStackTrace());
  }
}
