import { Component, Input } from '@angular/core';

/**
 * Simple graphic component to display a round image on the left of the card
 *
 * It support ng-content to display something (mainly text) centered under the image
 */
@Component({
  selector: 'fl-card-image',
  templateUrl: './fl-card-image.component.html',
  styleUrls: ['./fl-card-image.component.scss'],
  standalone: false,
})
export class FlCardImageComponent {
  /**
   * Image url
   */
  @Input() imageUrl: string;

  /**
   * Size of the image. Support all css sizes.
   */
  @Input() size: string = '3em';
}
