import { Component, Input } from '@angular/core';
import { CoBrick } from '../../model/co-brick.class';

@Component({
  selector: 'co-brick-list-item',
  templateUrl: './co-brick-list-item.component.html',
  styleUrls: ['./co-brick-list-item.component.scss'],
})
export class CoBrickListItemComponent {
  @Input({ required: true }) brick: CoBrick;
  @Input({ required: true }) brickImage: string;
}
