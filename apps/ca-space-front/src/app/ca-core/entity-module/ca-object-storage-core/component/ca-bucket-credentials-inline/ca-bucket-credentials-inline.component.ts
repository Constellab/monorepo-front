import { ChangeDetectionStrategy,Component, Input } from '@angular/core';

import { CaBucketCredentials } from '../../../../model/entities/ca-object-storage.class';

@Component({
  selector: 'ca-bucket-credentials-inline',
  templateUrl: './ca-bucket-credentials-inline.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./ca-bucket-credentials-inline.component.scss'],
})
export class CaBucketCredentialsInlineComponent {
  @Input() credentials: CaBucketCredentials;
}
