import { ChangeDetectionStrategy,Component } from '@angular/core';

@Component({
  selector: 'ha-list-of-items',
  templateUrl: './ha-list-of-items.component.html',
  styleUrls: ['./ha-list-of-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: []
})
export class HaListOfItemsComponent {}
