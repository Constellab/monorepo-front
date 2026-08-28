import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlClipboardService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * A single Claude Code command, shown as code on one line with a copy button.
 * The command is always built by the lab, never here.
 */
@Component({
  selector: 'lab-claude-plugin-command',
  templateUrl: './lab-claude-plugin-command.component.html',
  styleUrl: './lab-claude-plugin-command.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, TranslatePipe],
})
export class LabClaudePluginCommandComponent {
  private clipboardService = inject(FlClipboardService);

  command = input.required<string>();

  copyToClipboard(): void {
    this.clipboardService.copy(this.command(), 'flCoreComponent.copied_to_clipboard');
  }
}
