import { inject, Injectable, OnDestroy, Signal, signal, WritableSignal } from '@angular/core';
import { Subscription } from 'rxjs';

import { HaEntityType } from '../ha-model/ha-entities/ha-entity-type';
import { HaAuthenticatedUserService } from '../ha-service/ha-authenticated-user.service';
import { HaLikeService } from '../ha-service/ha-like.service';

@Injectable()
export class HaEntityLikeState implements OnDestroy {
  private likeService: HaLikeService = inject(HaLikeService);
  private authenticatedUserService = inject(HaAuthenticatedUserService);

  private isLiked: WritableSignal<boolean> = signal(null);
  private likesCount: WritableSignal<number> = signal(0);

  private entityId: string;
  private entityType: HaEntityType;

  private isLikedSubscription: Subscription;
  private likesCountSubscription: Subscription;

  public getIsLiked(): Signal<boolean> {
    return this.isLiked;
  }

  public getLikesCount(): Signal<number> {
    return this.likesCount;
  }

  public init(entityId: string, entityType: HaEntityType): void {
    this.entityId = entityId;
    this.entityType = entityType;

    this.authenticatedUserService.getUser().subscribe((user) => {
      if (user) this.setIsLiked(entityType, entityId);
      this.setLikesCount(entityType, entityId);
    });
  }

  public toggleLike(): void {
    if (this.isLiked() === null) return;

    if (this.isLiked()) {
      this.likeService.unlike(this.entityType, this.entityId).subscribe({
        next: () => {
          this.isLiked.set(false);
          this.likesCount.set(this.likesCount() - 1);
        },
      });
    } else {
      this.likeService.like(this.entityType, this.entityId).subscribe({
        next: () => {
          this.isLiked.set(true);
          this.likesCount.set(this.likesCount() + 1);
        },
      });
    }
  }

  private setIsLiked(entityType: HaEntityType, entityId: string): void {
    this.isLikedSubscription = this.likeService.checkIfLiked(entityType, entityId).subscribe({
      next: (isLiked) => {
        this.isLiked.set(isLiked);
      },
      error: () => {
        this.isLiked.set(false);
      },
    });
  }

  private setLikesCount(entityType: HaEntityType, entityId: string): void {
    this.likesCountSubscription = this.likeService.getLikeCount(entityType, entityId).subscribe({
      next: (likesCount) => {
        this.likesCount.set(likesCount);
      },
      error: () => {
        this.likesCount.set(0);
      },
    });
  }

  ngOnDestroy(): void {
    this.isLikedSubscription?.unsubscribe();
    this.likesCountSubscription?.unsubscribe();
  }
}
