import {Injectable} from '@angular/core';
import {FlApiService} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {HaStory} from '../ha-model/ha-entities/ha-story.class';

@Injectable({
  providedIn: 'root'
})
export class HaLikeStoryService {
  private readonly route: string = 'like-story';

  constructor(private apiService: FlApiService) {

  }

  public checkIfLiked(storyId: string): Observable<boolean> {
    return this.apiService.get(this.route + '/' + storyId);
  }

  public like(storyId: string): Observable<HaStory> {
    return this.apiService.post(this.route + '/' + storyId + '/like', {});
  }

  public unlike(storyId: string): Observable<HaStory> {
    return this.apiService.post(this.route + '/' + storyId + '/unlike', {});
  }
}
