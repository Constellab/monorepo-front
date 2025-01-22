import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CaServerCloud } from '../../../../model/entities/server/ca-server-cloud.class';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-server-cloud-inline',
  templateUrl: './ca-server-cloud-inline.component.html',
  styleUrls: ['./ca-server-cloud-inline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, TranslatePipe],
})
export class CaServerCloudInlineComponent {
  @Input({ required: true }) serverCloud: CaServerCloud;
}
