import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {LtLiveTask} from '../../model/lt-live-task.class';
import {TeRichText} from '@monorepo/text-editor';

export enum LtLiveTaskListItemColor {
  MAIN = 'main',
  CARD = 'card',
}

@Component({
  selector: 'lt-live-task-list-item',
  templateUrl: './lt-live-task-list-item.component.html',
  styleUrls: ['./lt-live-task-list-item.component.scss']
})
export class LtLiveTaskListItemComponent implements AfterViewInit{
  @Input()
  liveTask: LtLiveTask;

  @Input()
  backgroundColor: LtLiveTaskListItemColor | string = LtLiveTaskListItemColor.CARD;

  @ViewChild('mainCard') mainCardDiv: ElementRef;


  ngAfterViewInit(): void {
    if (this.backgroundColor === LtLiveTaskListItemColor.MAIN) {
      this.mainCardDiv.nativeElement.classList.add('main-bg');
    } else {
      this.mainCardDiv.nativeElement.classList.add('card-bg');
    }
  }

  getLiveTaskDescription(): string {
    return TeRichText.getFirstParagraphsText(this.liveTask.description);
  }

}
