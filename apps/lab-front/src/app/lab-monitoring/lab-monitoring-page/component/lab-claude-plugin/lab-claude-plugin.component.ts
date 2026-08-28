import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { FlApiServiceConfig } from '@monorepo/front-core-lib/fl-api';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiClaudePluginInfo, LiClaudePluginService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { LabClaudePluginCommandComponent } from '../lab-claude-plugin-command/lab-claude-plugin-command.component';
import { LabClaudePluginDevInstallComponent } from '../lab-claude-plugin-dev-install/lab-claude-plugin-dev-install.component';

/**
 * Show the commands to connect Claude Code to this lab.
 * Nothing here is editable: the plugin is derived from the lab id, name and served content.
 */
@Component({
  selector: 'lab-claude-plugin',
  templateUrl: './lab-claude-plugin.component.html',
  styleUrl: './lab-claude-plugin.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlCardModule,
    FlKeyValueModule,
    FlSectionModule,
    FlTextIconModule,
    LabClaudePluginCommandComponent,
    LabClaudePluginDevInstallComponent,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIconModule,
    NgTemplateOutlet,
    TranslatePipe,
  ],
})
export class LabClaudePluginComponent {
  // called once when the card opens, the values only change when the lab restarts
  pluginInfo$: Observable<LiClaudePluginInfo> = inject(LiClaudePluginService).getPluginInfo();

  // fallback address when the lab does not report an mcp url (URL_NOT_SUPPORTED)
  labUrl: string = inject(FlApiServiceConfig).getApiUrl();
}
