import { Component, Input } from '@angular/core';
import { FlTextIconModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

export enum HaProfileAttachedLinkType {
  LINKEDIN = 'linkedin',
  GITHUB = 'github',
  X = 'x',
}

@Component({
  selector: 'ha-profile-attached-link',
  templateUrl: './ha-profile-attached-link.component.html',
  styleUrl: './ha-profile-attached-link.component.scss',
  imports: [FlTextIconModule, MatIcon, TranslatePipe],
})
export class HaProfileAttachedLinkComponent {
  @Input({ required: true })
  attachedLink: string;

  @Input({ required: true })
  linkType: 'linkedin' | 'github' | 'x';
}
