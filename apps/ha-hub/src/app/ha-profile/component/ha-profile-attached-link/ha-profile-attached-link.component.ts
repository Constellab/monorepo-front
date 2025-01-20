import { Component, Input } from '@angular/core';

export enum HaProfileAttachedLinkType {
  LINKEDIN = 'linkedin',
  GITHUB = 'github',
  X = 'x',
}

@Component({
    selector: 'ha-profile-attached-link',
    templateUrl: './ha-profile-attached-link.component.html',
    styleUrl: './ha-profile-attached-link.component.scss',
    standalone: false
})
export class HaProfileAttachedLinkComponent {
  @Input({ required: true })
  attachedLink: string;

  @Input({ required: true })
  linkType: 'linkedin' | 'github' | 'x';
}
