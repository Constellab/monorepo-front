import { ChangeDetectionStrategy,Component } from '@angular/core';
import { MatIconAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { TranslatePipe } from '@ngx-translate/core';

import { CaRouterService } from '../../../ca-core/service/ca-router.service';

/**
 * Page used when a user is not part of an space
 */
@Component({
  selector: 'ca-no-space-page',
  templateUrl: './ca-no-space-page.component.html',
  styleUrls: ['./ca-no-space-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlCardModule, MatIconAnchor, RouterLink, MatIcon, TranslatePipe],
})
export class CaNoSpacePageComponent {
  loginRoute = CaRouterService.getLoginRoute();
}
