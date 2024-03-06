import {Component, Input} from '@angular/core';
import {TdTypeRefDTO} from '../../model/td-type.class';

@Component({
  selector: 'td-io-resource',
  templateUrl: './td-io-resource.component.html',
  styleUrls: ['./td-io-resource.component.scss']
})
export class TdIoResourceComponent {

  @Input({required: true}) resource: TdTypeRefDTO;

}
