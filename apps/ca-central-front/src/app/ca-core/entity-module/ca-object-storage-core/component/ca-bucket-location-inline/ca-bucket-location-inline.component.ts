import {Component, Input} from '@angular/core';
import {CaBucketLocationDTO} from '../../../../model/entities/ca-object-storage.class';

@Component({
  selector: 'ca-bucket-location-inline',
  templateUrl: './ca-bucket-location-inline.component.html',
  styleUrls: ['./ca-bucket-location-inline.component.scss'],
})
export class CaBucketLocationInlineComponent {

  @Input() bucketLocation: CaBucketLocationDTO;
}
