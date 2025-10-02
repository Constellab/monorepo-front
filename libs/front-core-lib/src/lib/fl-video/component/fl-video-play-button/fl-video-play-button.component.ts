import { Component } from '@angular/core';

@Component({
  selector: 'fl-video-play-button',
  template: `
    <div class="play-button">
      <mat-icon>play_arrow</mat-icon>
    </div>
  `,
  styles: [
    `
      .play-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        pointer-events: none;

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
      }

      :host-context(.carousel-item:hover) .play-button {
        background: white;
        transform: translate(-50%, -50%) scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      @media (max-width: 599px) {
        .play-button {
          width: 50px;
          height: 50px;

          mat-icon {
            font-size: 24px;
            width: 24px;
            height: 24px;
          }
        }
      }
    `,
  ],
  standalone: false,
})
export class FlVideoPlayButtonComponent {}
