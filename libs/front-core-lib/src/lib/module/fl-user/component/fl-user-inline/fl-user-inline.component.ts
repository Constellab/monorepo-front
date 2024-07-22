import {Component, Input, OnInit} from '@angular/core';
import {FlUser} from '../../model/fl-user.class';

@Component({
  selector: 'fl-user-inline',
  templateUrl: './fl-user-inline.component.html',
  styleUrls: ['./fl-user-inline.component.scss']
})
export class FlUserInlineComponent implements OnInit {

  @Input({required: true}) user: FlUser;


  @Input() showName: boolean = true;

  /**
   * If true a portal with the user profile will be displayed on hover
   */
  @Input() portalOnHover: boolean = true;

  /**
   * Default size of size in em
   */
  @Input() profilePictureSize: 'small' | 'medium' = 'small';

  ngOnInit(): void {
    if (this.user && !this.user.alias) {
      this.user.alias = this.user.firstname + ' ' + this.user.lastname;
    }
  }

  getTextSizeClass(): string {
    switch (this.profilePictureSize) {
      case 'small':
        return 'g-text-small';
      case 'medium':
        return 'g-text-normal';
    }
  }

}
