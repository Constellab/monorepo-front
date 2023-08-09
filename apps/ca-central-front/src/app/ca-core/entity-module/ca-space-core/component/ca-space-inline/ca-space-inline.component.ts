import {Component, Input, OnInit} from '@angular/core';
import {CaSpace} from '../../../../model/entities/space/ca-space.class';
import {Observable, of} from 'rxjs';
import {CaNotificationState} from '../../../../state/ca-notification.state';

@Component({
  selector: 'ca-space-inline',
  templateUrl: './ca-space-inline.component.html',
  styleUrls: ['./ca-space-inline.component.scss']
})
export class CaSpaceInlineComponent implements OnInit {

  @Input() space: CaSpace;

  @Input() showNotif: boolean = true;

  notifCount: Observable<string>;

  constructor(private notificationState: CaNotificationState) {
  }

  ngOnInit(): void {
    if (this.showNotif) {
      this.notifCount = this.notificationState.getSpaceNotificationCount(this.space.id);
    } else {
      this.notifCount = of('');
    }
  }

}
