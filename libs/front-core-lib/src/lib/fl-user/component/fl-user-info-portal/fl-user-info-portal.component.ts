import { Component, inject, OnInit } from '@angular/core';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib/fl-portal';
import { FlUser } from '../../model/fl-user.class';
import { FlUserConfig } from '../../service/fl-user-config.config';

/**
 * Simple portal to show the user information
 */
@Component({
  selector: 'fl-user-info-portal',
  templateUrl: './fl-user-info-portal.component.html',
  styleUrls: ['./fl-user-info-portal.component.scss'],
  standalone: false,
})
export class FlUserInfoPortalComponent implements OnInit {
  private userConfig = inject(FlUserConfig);

  user: FlUser = inject(FL_PORTAL_DATA);

  userRoute: string;

  ngOnInit(): void {
    this.userRoute = this.userConfig.getUserDetailRoute(this.user.id);
  }
}
