import { Component, Input } from '@angular/core';

import { CoListStoryDto } from '../../model/co-story.class';

@Component({
  selector: 'co-story-list-item',
  templateUrl: './co-story-list-item.component.html',
  styleUrls: ['./co-story-list-item.component.scss'],
  standalone: false,
})
export class CoStoryListItemComponent {
  @Input({ required: true }) story: CoListStoryDto;
  @Input() imageLink?: string;
}
