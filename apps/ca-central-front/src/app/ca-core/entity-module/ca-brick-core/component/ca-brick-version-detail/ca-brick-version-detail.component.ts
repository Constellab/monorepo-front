import { Component, Input } from '@angular/core';
import { CaBrickVersion } from '../../../../model/entities/ca-brick.class';
import { CoCommunityHelperService } from '@monorepo/community-lib';

/**
 * Simple component to show brick version detail
 */
@Component({
  selector: 'ca-brick-version-detail',
  templateUrl: './ca-brick-version-detail.component.html',
  styleUrls: ['./ca-brick-version-detail.component.scss'],
})
export class CaBrickVersionDetailComponent {
  @Input() brickName: string;
  @Input() brickVersion: CaBrickVersion;

  constructor(private coCommunityHelper: CoCommunityHelperService) {}

  get communityLink(): string {
    return this.coCommunityHelper.getBrickUrl(this.brickName, this.brickVersion.version);
  }
}
