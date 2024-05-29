import {Component, Input} from '@angular/core';
import {TdTechDocFunction} from '../../model/td-resource-type.class';

@Component({
  selector: 'td-vars-methods-doc',
  templateUrl: './td-vars-methods-doc.component.html',
  styleUrls: ['./td-vars-methods-doc.component.scss']
})
export class TdVarsMethodsDocComponent {

  @Input({required: true}) funcs: TdTechDocFunction[];
  @Input() variables: Record<string, any>;
}
