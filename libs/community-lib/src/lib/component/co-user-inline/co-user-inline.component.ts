import {Component, Input} from '@angular/core';
import { CoUser } from '../../model/co-user.class';


@Component({
  selector: 'co-user-inline',
  templateUrl: './co-user-inline.component.html',
  styleUrl: './co-user-inline.component.scss'
})
export class CoUserInlineComponent {
  @Input({required: true}) user: CoUser;

  /**
   * Default size of size in em
   */
  @Input() profilePictureSize: 'small' | 'medium' = 'small';

  getTextSizeClass(): string {
    switch (this.profilePictureSize) {
      case 'small':
        return 'g-text-small';
      case 'medium':
        return 'g-text-normal';
    }
  }
}
