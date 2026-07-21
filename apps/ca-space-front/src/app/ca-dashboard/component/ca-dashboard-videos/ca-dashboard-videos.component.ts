import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';

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

  youtubeVideos: CaYoutubeVideo[] = [];

  selectedVideo: CaYoutubeVideo;

  private interval: any;

  ngOnInit(): void {
    this.settingsService.getTutorialVideos().subscribe((videos) => this.getVideosSuccess(videos));
  }

  private getVideosSuccess(videos: CaYoutubeVideo[]): void {
    if (videos?.length > 0) {
      this.youtubeVideos = videos;
      this.selectedVideo = this.youtubeVideos[0];
      this.resetInterval();
    }
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
    const currentIndex = this.youtubeVideos.indexOf(this.selectedVideo);
    let nextIndex = currentIndex + 1;
    if (nextIndex >= this.youtubeVideos.length) {
      nextIndex = 0;
    }
    this.selectedVideo = this.youtubeVideos[nextIndex];
  }

  private previousVideo(): void {
    const currentIndex = this.youtubeVideos.indexOf(this.selectedVideo);
    let previousIndex = currentIndex - 1;
    if (previousIndex < 0) {
      previousIndex = this.youtubeVideos.length - 1;
    }
    this.selectedVideo = this.youtubeVideos[previousIndex];
  }

  selectVideo(video: CaYoutubeVideo): void {
    this.selectedVideo = video;
    this.resetInterval();
  }
}
