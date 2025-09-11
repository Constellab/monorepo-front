import { inject, Injectable, OnDestroy, Signal, signal, WritableSignal } from '@angular/core';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { TeRichText } from '@monorepo/text-editor';
import { Observable, Subscription } from 'rxjs';

import {
  HaAbstractComment,
  HaCommentEntity,
} from '../entity-module/ha-comments-core/model/ha-abstract-comment.class';
import { HaEntityType } from '../ha-model/ha-entities/ha-entity-type';
import { HaCommentService } from '../ha-service/ha-comment.service';

@Injectable()
export class HaEntityCommentState implements OnDestroy {
  private commentService: HaCommentService = inject(HaCommentService);

  private commentsCount: WritableSignal<number> = signal(0);

  private entityType: HaEntityType;
  private entityId: string;

  private commentsCountSubscription: Subscription;

  public getCommentsCount(): Signal<number> {
    return this.commentsCount;
  }

  public init(entityType: HaEntityType, entityId: string): void {
    this.entityType = entityType;
    this.entityId = entityId;
    this.commentsCountSubscription = this.commentService
      .getCommentsCount(entityType, entityId)
      .subscribe((count) => {
        this.commentsCount.set(count);
      });
  }

  public getComments(): FlDatasourcePaginated<HaAbstractComment<HaCommentEntity>> {
    return this.commentService.getComments(this.entityType, this.entityId);
  }

  public sendComment(content: TeRichText): Observable<HaAbstractComment<HaCommentEntity>> {
    return this.commentService.sendComment(this.entityType, content, this.entityId).pipe((comment) => {
      this.incrementCommentsCount();
      return comment;
    });
  }

  private incrementCommentsCount(): void {
    this.commentsCount.update((count) => count + 1);
  }

  ngOnDestroy(): void {
    this.commentsCountSubscription?.unsubscribe();
  }
}
