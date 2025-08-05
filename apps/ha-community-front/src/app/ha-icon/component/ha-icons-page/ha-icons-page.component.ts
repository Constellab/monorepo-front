import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CoIcon } from '@monorepo/community-lib';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaIsGencoveryMemberDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-is-gencovery-member/ha-is-gencovery-member.directive';
import { HaSidenavButtonDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-sidenav-button/ha-sidenav-button.directive';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import {
  HaCreateIconDtoInput,
  HaIconCreateDialogComponent,
} from '../ha-icon-create-dialog/ha-icon-create-dialog.component';
import { HaIconListComponent } from '../ha-icon-list/ha-icon-list.component';

@Component({
  selector: 'ha-icons-page',
  templateUrl: './ha-icons-page.component.html',
  styleUrls: ['./ha-icons-page.component.scss'],
  imports: [
    HaIsGencoveryMemberDirective,
    MatButton,
    MatIcon,
    HaIconListComponent,
    TranslatePipe,
    HaSidenavButtonDirective,
  ],
})
export class HaIconsPageComponent extends HaCommunityPageDirective implements OnInit, OnDestroy {
  private dialogService: FlDialogService = inject(FlDialogService);

  reloadList$ = new Subject<boolean>();

  ngOnInit(): void {
    super.setMetaTags(
      {
        text: 'ha.icons.title',
        translateText: true,
      },
      {
        text: 'ha.icons.description',
        translateText: true,
      },
      null,
      HaRouterService.getFullRoute(HaRouterService.getIconsRoute())
    );
  }

  openCreateIconDialog(): void {
    const inputData: HaCreateIconDtoInput = {
      mode: 'create',
      object: null,
    };
    this.dialogService
      .openSmallDialog(HaIconCreateDialogComponent, { data: inputData })
      .afterClosed()
      .subscribe((icon: CoIcon) => {
        if (icon) {
          this.reloadList$.next(true);
        }
      });
  }

  ngOnDestroy(): void {
    this.reloadList$.complete();
  }
}
