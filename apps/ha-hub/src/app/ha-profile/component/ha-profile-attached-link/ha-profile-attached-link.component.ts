import {Component, Input, OnInit} from '@angular/core';

export enum HaProfileAttachedLinkType {
  LINKEDIN='linkedin',
  GITHUB='github',
  X='x',
}

@Component({
  selector: 'ha-profile-attached-link',
  templateUrl: './ha-profile-attached-link.component.html',
  styleUrl: './ha-profile-attached-link.component.scss'
})
export class HaProfileAttachedLinkComponent implements OnInit{

  @Input({required: true})
  attachedLink: string;

  @Input({required: true})
  linkType: 'linkedin' | 'github' | 'x';

  linkPage: string;

  ngOnInit(): void {
    this.linkPage = this.getLinkPage();
  }

  private getLinkPage(): string{
    if (this.attachedLink[this.attachedLink.length - 1] === '/') {
      this.attachedLink = this.attachedLink.slice(0, -1);
    }
    return this.attachedLink.split('/').pop();
  }
}
