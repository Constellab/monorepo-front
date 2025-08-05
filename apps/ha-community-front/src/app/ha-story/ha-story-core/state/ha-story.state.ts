import { computed, inject,Injectable, OnDestroy, Signal, signal, WritableSignal } from '@angular/core';

import { HaStory } from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';

@Injectable()
export class HaStoryState implements OnDestroy {
  private storyService = inject(HaStoryService);

  private storyId: WritableSignal<string> = signal(null);
  public readonly storyId$: Signal<string> = this.storyId;
  private story: WritableSignal<HaStory> = signal(null);
  public readonly story$: Signal<HaStory> = computed(() => this.story());

  public init(storyId: string): void {
    this.storyId.set(storyId);
    this.initStory(storyId);
  }

  ngOnDestroy(): void {}

  private initStory(storyId: string): void {
    this.storyService.getById(storyId).subscribe((story) => {
      if (story) this.initStorySuccess(story);
    });
  }

  private initStorySuccess(story: HaStory): void {
    this.story.set(story);
  }
}
