import {Component, Input} from '@angular/core';
import {CaBrickVersion} from '../../../../model/entities/ca-brick.class';
import {CaCommunityHelper} from '../../../../utils/ca-community.helper';

/**
 * Simple component to show brick version detail
 */
@Component({
  selector: 'ca-brick-version-detail',
  templateUrl: './ca-brick-version-detail.component.html',
  styleUrls: ['./ca-brick-version-detail.component.scss']
})
export class CaBrickVersionDetailComponent {

  @Input() brickName: string;
  @Input() brickVersion: CaBrickVersion;

  get communityLink(): string {
    return CaCommunityHelper.getBrickUrl(this.brickName, this.brickVersion.version);
  }
}
