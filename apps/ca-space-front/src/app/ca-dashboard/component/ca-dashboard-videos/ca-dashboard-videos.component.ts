import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, of } from 'rxjs';

import { CaYoutubeVideo } from '../../../ca-core/model/entities/server/ca-server-standard.class';
import { CaSettingsService } from '../../../ca-core/service-api/ca-settings.service';

@Component({
  selector: 'ca-dashboard-videos',
  templateUrl: './ca-dashboard-videos.component.html',
  styleUrl: './ca-dashboard-videos.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlCardModule, FlTextIconModule, MatIcon, MatIconButton, NgOptimizedImage, NgClass, TranslatePipe],
})
export class CaDashboardVideosComponent implements OnInit {
  private settingsService = inject(CaSettingsService);

  youtubeVideos = signal<CaYoutubeVideo[]>([]);

  selectedVideo = signal<CaYoutubeVideo | null>(null);

  private interval: any;

  ngOnInit(): void {
    // the videos are a nice to have, if the call fails the section is simply hidden
    this.settingsService
      .getTutorialVideos()
      .pipe(catchError(() => of([])))
      .subscribe((videos) => this.getVideosSuccess(videos));
  }

  private getVideosSuccess(videos: CaYoutubeVideo[]): void {
    if (!videos?.length) {
      return;
    }
    this.youtubeVideos.set(videos);
    this.selectedVideo.set(videos[0]);
    this.resetInterval();
  }

  private resetInterval(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => this.nextVideo(), 15000);
  }

  nextVideoManually(): void {
    this.nextVideo();
    this.resetInterval();
  }

  previousVideoManually(): void {
    this.previousVideo();
    this.resetInterval();
  }

  private nextVideo(): void {
    const videos = this.youtubeVideos();
    const currentVideo = this.selectedVideo();
    if (!currentVideo) {
      return;
    }
    let nextIndex = videos.indexOf(currentVideo) + 1;
    if (nextIndex >= videos.length) {
      nextIndex = 0;
    }
    this.selectedVideo.set(videos[nextIndex]);
  }

  private previousVideo(): void {
    const videos = this.youtubeVideos();
    const currentVideo = this.selectedVideo();
    if (!currentVideo) {
      return;
    }
    let previousIndex = videos.indexOf(currentVideo) - 1;
    if (previousIndex < 0) {
      previousIndex = videos.length - 1;
    }
    this.selectedVideo.set(videos[previousIndex]);
  }

  selectVideo(video: CaYoutubeVideo): void {
    this.selectedVideo.set(video);
    this.resetInterval();
  }
}
