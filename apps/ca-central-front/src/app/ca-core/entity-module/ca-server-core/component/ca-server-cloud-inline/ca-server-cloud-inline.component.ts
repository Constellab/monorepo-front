import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CaServerCloud } from '../../../../model/entities/server/ca-server-cloud.class';

@Component({
  selector: 'ca-server-cloud-inline',
  templateUrl: './ca-server-cloud-inline.component.html',
  styleUrls: ['./ca-server-cloud-inline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaServerCloudInlineComponent {
  @Input({ required: true }) serverCloud: CaServerCloud;
}
