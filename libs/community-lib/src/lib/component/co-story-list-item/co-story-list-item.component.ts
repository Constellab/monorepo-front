import {Component, Input, OnInit} from '@angular/core';
import {CoListStoryDto, CoStoryTopic} from '../../model/co-story.class';

@Component({
  selector: 'co-story-list-item',
  templateUrl: './co-story-list-item.component.html',
  styleUrls: ['./co-story-list-item.component.scss']
})
export class CoStoryListItemComponent implements OnInit {
  @Input({required: true}) story: CoListStoryDto;
  @Input() imageLink?: string;
  topics: CoStoryTopic[];

  constructor() {
  }

  ngOnInit(): void {
    this.topics = this.story.topics.sort((a, b) => a.popularity - b.popularity);
  }
}
