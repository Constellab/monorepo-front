import { Component, OnInit } from '@angular/core';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import { FlAuthModule } from '@monorepo/front-core-lib/fl-auth';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-signup-page',
  templateUrl: './ca-signup-page.component.html',
  styleUrls: ['./ca-signup-page.component.scss'],
  imports: [FlAuthModule, RouterLink, TranslatePipe],
})
export class CaSignupPageComponent implements OnInit {
  loginRoute: string = CaRouterService.getLoginRoute();

  constructor() {}

  ngOnInit(): void {}
}
