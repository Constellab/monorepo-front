import {Component, Input, OnInit} from '@angular/core';
import {CoLiveTask} from '../../model/co-live-task.class';
import {TeRichText} from '@monorepo/text-editor';


@Component({
  selector: 'co-live-task-list-item',
  templateUrl: './co-live-task-list-item.component.html',
  styleUrls: ['./co-live-task-list-item.component.scss']
})
export class CoLiveTaskListItemComponent implements OnInit {
  @Input()
  liveTask: CoLiveTask;

  description: string;

  ngOnInit(): void {
    this.description = TeRichText.getFirstParagraphsText(this.liveTask.description);
  }
}
