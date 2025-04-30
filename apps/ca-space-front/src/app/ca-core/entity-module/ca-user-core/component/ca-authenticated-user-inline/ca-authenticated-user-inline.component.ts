import { Component, inject, Input, OnInit } from '@angular/core';
import { CaUser } from '../../../../model/entities/ca-user.class';
import { CaAuthenticatedUserService } from '../../../../service-api/ca-authenticated-user.service';
import { CaRouterService } from '../../../../service/ca-router.service';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { AsyncPipe } from '@angular/common';

/**
 * Component to display the current user photo, name and job
 */
@Component({
  selector: 'ca-authenticated-user-inline',
  templateUrl: './ca-authenticated-user-inline.component.html',
  styleUrls: ['./ca-authenticated-user-inline.component.scss'],
  imports: [RouterLink, FlUserModule, AsyncPipe],
})
export class CaAuthenticatedUserInlineComponent implements OnInit {
  private authenticatedUserService = inject(CaAuthenticatedUserService);

  @Input() showName: boolean = true;

  user$: Observable<CaUser>;

  route: string;

  ngOnInit(): void {
    this.user$ = this.authenticatedUserService.getUser$();
    this.route = CaRouterService.getUserDetailRoute(this.authenticatedUserService.getCurrentUser().id);
  }
}
