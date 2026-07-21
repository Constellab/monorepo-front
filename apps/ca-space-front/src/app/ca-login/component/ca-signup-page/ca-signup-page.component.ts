import { ChangeDetectionStrategy,Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FlAuthModule } from '@monorepo/front-core-lib/fl-auth';
import { TranslatePipe } from '@ngx-translate/core';

import { CaRouterService } from '../../../ca-core/service/ca-router.service';

@Component({
  selector: 'ca-signup-page',
  templateUrl: './ca-signup-page.component.html',
  styleUrls: ['./ca-signup-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlAuthModule, RouterLink, TranslatePipe],
})
export class CaSignupPageComponent {
  loginRoute: string = CaRouterService.getLoginRoute();
}
