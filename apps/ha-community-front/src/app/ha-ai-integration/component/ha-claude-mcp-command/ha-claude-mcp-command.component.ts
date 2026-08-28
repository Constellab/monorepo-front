import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlClipboardService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * A single Claude Code command, shown as code on one line with a copy button.
 * The command always comes from the back-end, never built here.
 */
@Component({
  selector: 'ha-claude-mcp-command',
  templateUrl: './ha-claude-mcp-command.component.html',
  styleUrls: ['./ha-claude-mcp-command.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, TranslatePipe],
})
export class HaClaudeMcpCommandComponent {
  private clipboardService = inject(FlClipboardService);

  command = input.required<string>();

  copyToClipboard(): void {
    this.clipboardService.copy(this.command(), 'ai_integration.copied');
  }
}
