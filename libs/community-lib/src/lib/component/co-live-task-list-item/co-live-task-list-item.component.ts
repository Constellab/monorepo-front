import {Component, Input, OnInit} from '@angular/core';
import {CoLiveTask} from '../../model/co-live-task.class';
import {TeRichText} from '@monorepo/text-editor';
import {CoCommunityListItemColor} from '../co-community-list-item/co-community-list-item.component';


@Component({
  selector: 'co-live-task-list-item',
  templateUrl: './co-live-task-list-item.component.html',
  styleUrls: ['./co-live-task-list-item.component.scss']
})
export class CoLiveTaskListItemComponent implements OnInit {
  @Input()
  liveTask: CoLiveTask;

  @Input()
  backgroundColor: CoCommunityListItemColor | string = CoCommunityListItemColor.CARD;

  description: string;

  ngOnInit(): void {
    this.description = TeRichText.getFirstParagraphsText(this.liveTask.description);
  }
}
