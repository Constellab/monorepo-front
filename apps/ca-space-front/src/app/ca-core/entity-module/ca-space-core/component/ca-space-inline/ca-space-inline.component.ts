import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { Observable, of } from 'rxjs';

import { CaSpace } from '../../../../model/entities/space/ca-space.class';
import { CaNotificationState } from '../../../../state/ca-notification.state';
import { CaSpacePhotoComponent } from '../ca-space-photo/ca-space-photo.component';

@Component({
  selector: 'ca-space-inline',
  templateUrl: './ca-space-inline.component.html',
  styleUrls: ['./ca-space-inline.component.scss'],
  imports: [CaSpacePhotoComponent, MatBadge, AsyncPipe],
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
