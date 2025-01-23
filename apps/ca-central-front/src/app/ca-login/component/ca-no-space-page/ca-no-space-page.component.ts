import { Component, OnInit } from '@angular/core';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { MatIconAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Page used when a user is not part of an space
 */
@Component({
  selector: 'ca-no-space-page',
  templateUrl: './ca-no-space-page.component.html',
  styleUrls: ['./ca-no-space-page.component.scss'],
  imports: [FlCardModule, MatIconAnchor, RouterLink, MatIcon, TranslatePipe],
})
export class CaNoSpacePageComponent implements OnInit {
  loginRoute = CaRouterService.getLoginRoute();
  constructor() {}

  ngOnInit(): void {}
}
