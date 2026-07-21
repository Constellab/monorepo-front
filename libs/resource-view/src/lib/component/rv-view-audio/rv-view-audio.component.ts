import { ChangeDetectionStrategy,Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { RvResourceViewAudio } from '../../model/rv-resource-view.class';
import { RvResourceViewDirective } from '../../model/rv-resource-view.directive';

@Component({
  selector: 'rv-view-audio',
  templateUrl: './rv-view-audio.component.html',
  styleUrl: './rv-view-audio.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RvViewAudioComponent extends RvResourceViewDirective<RvResourceViewAudio> implements OnInit {
  @ViewChild('audio', { static: true }) audioRef!: ElementRef<HTMLAudioElement>;

  ngOnInit(): void {
    // Set the source of the audio element
    this.audioRef.nativeElement.src =
      `data:${this.view.data.mime_type};base64,${this.view.data.base_64_audio}`;
  }
}
