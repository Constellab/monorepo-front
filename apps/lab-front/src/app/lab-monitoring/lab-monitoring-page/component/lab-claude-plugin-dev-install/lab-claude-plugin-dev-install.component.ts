import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FlDeviceHelper } from '@monorepo/front-core-lib/fl-core';
import { LiClaudePluginDevInstall } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LabClaudePluginCommandComponent } from '../lab-claude-plugin-command/lab-claude-plugin-command.component';

type LabClaudePluginOs = 'posix' | 'windows';

/**
 * Install the plugin from a local folder, for a lab Claude Code refuses to install from its
 * marketplace url (a lab on localhost). A shell script runs on the developer's machine and
 * prints the `/plugin marketplace add` line, which is why that line is never shown here.
 */
@Component({
  selector: 'lab-claude-plugin-dev-install',
  templateUrl: './lab-claude-plugin-dev-install.component.html',
  styleUrl: './lab-claude-plugin-dev-install.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LabClaudePluginCommandComponent, MatButtonToggleModule, TranslatePipe],
})
export class LabClaudePluginDevInstallComponent {
  devInstall = input.required<LiClaudePluginDevInstall>();

  selectedOs = signal<LabClaudePluginOs>(FlDeviceHelper.isWindows() ? 'windows' : 'posix');

  command = computed(() =>
    this.selectedOs() === 'windows' ? this.devInstall().windowsCommand : this.devInstall().posixCommand
  );
}
