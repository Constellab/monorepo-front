import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RvResourceViewDirective } from '../../model/rv-resource-view.directive';
import { RvResourceViewHTML } from '../../model/rv-resource-view.class';

@Component({
  selector: 'rv-view-html',
  templateUrl: './rv-view-html.component.html',
  styleUrls: ['./rv-view-html.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RvViewHtmlComponent extends RvResourceViewDirective<RvResourceViewHTML> {}
