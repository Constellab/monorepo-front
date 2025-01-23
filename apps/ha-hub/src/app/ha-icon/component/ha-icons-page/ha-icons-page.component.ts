import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib';
import { Subject } from 'rxjs';
import {
  HaCreateIconDtoInput,
  HaIconCreateDialogComponent,
} from '../ha-icon-create-dialog/ha-icon-create-dialog.component';
import { CoIcon } from '@monorepo/community-lib';
import { HaCommunityPage } from '../../../ha-core/utils/ha-community.page';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaIsGencoveryMemberDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-is-gencovery-member/ha-is-gencovery-member.directive';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HaIconListComponent } from '../ha-icon-list/ha-icon-list.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ha-icons-page',
  templateUrl: './ha-icons-page.component.html',
  styleUrls: ['./ha-icons-page.component.scss'],
  imports: [HaIsGencoveryMemberDirective, MatButton, MatIcon, HaIconListComponent, TranslatePipe],
})
export class HaIconsPageComponent extends HaCommunityPage implements OnInit, OnDestroy {
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
