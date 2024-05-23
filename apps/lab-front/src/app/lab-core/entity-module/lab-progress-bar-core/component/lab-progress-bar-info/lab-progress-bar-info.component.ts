import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  LabProgressBar,
  LabProgressBarMessages,
  LabProgressMessage,
  LabProgressMessageDatasource
} from '../../../../model/entities/lab-progress-bar.entity';
import {mergeMap, Observable, Subscription} from 'rxjs';
import {filter, first, map} from 'rxjs/operators';
import {LabProgressBarService} from '../../../../entity-service/lab-progress-bar.service';
import {clRxjsDebug} from '@monorepo/core-lib';

interface LabProgressWithMessage {
  progressBar?: LabProgressBar;
  messages: LabProgressBarMessages;

}

/**
 * Show information about a {@link LabProgressBar}
 */
@Component({
  selector: 'lab-progress-bar-info',
  templateUrl: './lab-progress-bar-info.component.html',
  styleUrls: ['./lab-progress-bar-info.component.scss']
})
export class LabProgressBarInfoComponent implements OnInit, OnDestroy {

  @Input({required: true}) progressBar$: Observable<LabProgressBar>;

  @Input({required: true}) scrollableElement: HTMLElement;

  messageDatasource: LabProgressMessageDatasource;
  messages$: Observable<LabProgressMessage[]>;

  elapsedTime$: Observable<number>;

  loadMoreIsLoading = false;
  loadMoreCompleted = false;

  // when true, the component will reload the last 20 messages every time the progress bar is updated
  // if replaces all the messages in the list
  // if load more messages is called, the live mode is disabled automatically to avoid conflict
  // if the progress bar is completed, the live mode is disabled automatically
  // when false, new messages are not loaded
  liveMode: boolean = null;

  // store if the progress bar was finished when the component was initialized
  showLiveModeToggle: boolean = null;

  private subscription?: Subscription;

  private readonly nbOfMessages = 20;
  private progressBarId: string;

  constructor(private progressBarService: LabProgressBarService) {

  }

  ngOnInit(): void {
    this.messageDatasource = new LabProgressMessageDatasource();
    this.messages$ = this.messageDatasource.connect();

    this.elapsedTime$ = this.progressBar$.pipe(
      map(progressBar => progressBar.elapsedTime),
    );

    // every time the progress bar updated (reload from state), refresh the message list
    this.subscription = this.progressBar$.pipe(
      clRxjsDebug(),
      filter(() => this.liveMode !== false),
      mergeMap(progressBar => this.getMessages(progressBar)))
      .subscribe(
        messages => this.addMessageToList(messages)
      );
  }

  private getMessages(progressBar: LabProgressBar): Observable<LabProgressWithMessage> {
    this.progressBarId = progressBar.id;

    // init live mode and show live mode toggle on first load
    // enable live mode if the progress bar is not completed
    if (this.liveMode == null) {
      this.liveMode = progressBar.endedAt == null;
    }
    if (this.showLiveModeToggle == null) {
      this.showLiveModeToggle = progressBar.endedAt != null;
    }
    // get the last 20 messages
    return this.progressBarService.getProgressBarMessages(progressBar.id, this.nbOfMessages).pipe(
      map(messages => ({progressBar, messages: messages}))
    );
  }

  loadMoreMessagesManually(): void {
    this.liveMode = false;
    this.loadMoreMessages();
  }

  private loadMoreMessages(): void {
    if (this.loadMoreIsLoading || this.loadMoreCompleted) return;

    this.loadMoreIsLoading = true;

    const lastMessageDatetime = this.messageDatasource.array[this.messageDatasource.array.length - 1]?.datetime;
    if (lastMessageDatetime) {
      // load message that are older than the last message in the list
      this.progressBarService.getProgressBarMessages(this.progressBarId, this.nbOfMessages, lastMessageDatetime).subscribe(
        {
          next: messages => this.loadMoreMessagesSuccess({
            messages: messages
          }),
          error: () => this.loadMoreIsLoading = false
        });
    }
  }

  private loadMoreMessagesSuccess(progressWithMessage: LabProgressWithMessage): void {
    this.loadMoreIsLoading = false;
    this.addMessageToList(progressWithMessage);
  }

  // add message to the list, avoid duplicate and respect order
  private addMessageToList(progressWithMessage: LabProgressWithMessage): void {
    if (this.liveMode) {
      // in live mode we clear all messages
      this.messageDatasource.clear();
    } else {
      this.messageDatasource.removeItem(progressWithMessage.messages.messages);
    }

    if (progressWithMessage.progressBar) {
      // refresh the live mode and show live mode toggle,
      // if the progress bar is completed, the live mode is disabled automatically
      this.liveMode = progressWithMessage.progressBar.endedAt == null;
      this.showLiveModeToggle = progressWithMessage.progressBar.endedAt != null;
    }

    this.messageDatasource.addItem(progressWithMessage.messages.messages, (a, b) => a.datetime > b.datetime);

    // if the number of messages is less than the number of messages requested, it means that there is no more messages
    if (progressWithMessage.messages.messages.length < this.nbOfMessages) {
      this.loadMoreCompleted = true;
    } else if (this.liveMode && progressWithMessage.messages.messages.length >= this.nbOfMessages) {
      // if we are in live mode and we have more messages than requested, it means that there is more messages
      this.loadMoreCompleted = false;
    }
  }

  liveModeChanged(): void {
    // if the live mode was enabled manually, we clear all messages and reload the last 20 messages
    if (this.liveMode === true) {
      this.messageDatasource.clear();
      this.loadMoreCompleted = false;
      this.progressBar$.pipe(first()).subscribe(progressBar => this.getMessages(progressBar).subscribe(
        messages => this.addMessageToList(messages)
      ));

    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.messageDatasource.disconnect();
  }

}
