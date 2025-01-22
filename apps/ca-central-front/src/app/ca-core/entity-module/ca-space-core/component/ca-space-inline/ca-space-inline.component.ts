import { Component, Input, OnInit, inject } from '@angular/core';
import { CaSpace } from '../../../../model/entities/space/ca-space.class';
import { Observable, of } from 'rxjs';
import { CaNotificationState } from '../../../../state/ca-notification.state';

@Component({
  selector: 'ca-space-inline',
  templateUrl: './ca-space-inline.component.html',
  styleUrls: ['./ca-space-inline.component.scss'],
  standalone: false,
})
export class CaSpaceInlineComponent implements OnInit {
  private notificationState = inject(CaNotificationState);

  @Input() space: CaSpace;

  @Input() showNotif: boolean = true;

  notifCount: Observable<string>;

  ngOnInit(): void {
    if (this.showNotif) {
      this.notifCount = this.notificationState.getSpaceNotificationCount(this.space.id);
    } else {
      this.notifCount = of('');
    }
  }
}
