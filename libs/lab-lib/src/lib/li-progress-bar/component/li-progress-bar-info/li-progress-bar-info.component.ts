import { AsyncPipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LiProgressBar,
  LiProgressBarMessages,
  LiProgressBarService,
  LiProgressMessage,
  LiProgressMessageDatasource,
} from '@monorepo/lab-lib/li-core';
import { LiProgressMessageComponent } from '../li-progress-message/li-progress-message.component';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Observable, Subscription, mergeMap } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, first, map } from 'rxjs/operators';

interface LabProgressWithMessage {
  progressBar?: LiProgressBar;
  messages: LiProgressBarMessages;
}

/**
 * Show information about a {@link LiProgressBar}
 */
@Component({
  selector: 'li-progress-bar-info',
  templateUrl: './li-progress-bar-info.component.html',
  styleUrls: ['./li-progress-bar-info.component.scss'],
  imports: [
    FlKeyValueModule,
    FlTextIconModule,
    MatIcon,
    FlLoaderModule,
    MatSlideToggle,
    ReactiveFormsModule,
    FormsModule,
    FlInfiniteScrollModule,
    LiProgressMessageComponent,
    MatDivider,
    MatButton,
    AsyncPipe,
    TranslatePipe,
    FlDateModule,
  ],
})
export class LiProgressBarInfoComponent implements OnInit, OnDestroy {
  private progressBarService = inject(LiProgressBarService);

  @Input({ required: true }) progressBar$: Observable<LiProgressBar>;

  @Input({ required: true }) scrollableElement: HTMLElement;

  messageDatasource: LiProgressMessageDatasource;
  messages$: Observable<LiProgressMessage[]>;

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

  ngOnInit(): void {
    this.messageDatasource = new LiProgressMessageDatasource();
    this.messages$ = this.messageDatasource.connect();

    this.elapsedTime$ = this.progressBar$.pipe(map((progressBar) => progressBar.elapsedTime));

    // every time the progress bar updated (reload from state), refresh the message list
    this.subscription = this.progressBar$
      .pipe(
        filter(() => this.liveMode !== false),
        mergeMap((progressBar) => this.getMessages(progressBar))
      )
      .subscribe((messages) => this.addMessageToList(messages));
  }

  private getMessages(progressBar: LiProgressBar): Observable<LabProgressWithMessage> {
    this.progressBarId = progressBar.id;

    // init live mode and show live mode toggle on first load
    // enable live mode if the progress bar is not completed
    if (this.liveMode == null) {
      this.liveMode = progressBar.isRunning();
    }
    if (this.showLiveModeToggle == null) {
      this.showLiveModeToggle = progressBar.isRunning();
    }
    // get the last 20 messages
    return this.progressBarService
      .getProgressBarMessages(progressBar.id, this.nbOfMessages)
      .pipe(map((messages) => ({ progressBar, messages: messages })));
  }

  loadMoreMessagesManually(): void {
    this.liveMode = false;
    this.loadMoreMessages();
  }

  private loadMoreMessages(): void {
    if (this.loadMoreIsLoading || this.loadMoreCompleted) return;

    this.loadMoreIsLoading = true;

    const lastMessageDatetime =
      this.messageDatasource.array[this.messageDatasource.array.length - 1]?.datetime;
    if (lastMessageDatetime) {
      // load message that are older than the last message in the list
      this.progressBarService
        .getProgressBarMessages(this.progressBarId, this.nbOfMessages, lastMessageDatetime)
        .subscribe({
          next: (messages) =>
            this.loadMoreMessagesSuccess({
              messages: messages,
            }),
          error: () => (this.loadMoreIsLoading = false),
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
      this.liveMode = progressWithMessage.progressBar.isRunning();
      this.showLiveModeToggle = progressWithMessage.progressBar.isRunning();
    }

    this.messageDatasource.addItem(progressWithMessage.messages.messages, (a, b) => a.datetime > b.datetime);

    // if the number of messages is less than the number of messages requested,
    // it means that there is no more messages
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
      this.progressBar$
        .pipe(first())
        .subscribe((progressBar) =>
          this.getMessages(progressBar).subscribe((messages) => this.addMessageToList(messages))
        );
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.messageDatasource.disconnect();
  }
}
