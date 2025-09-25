import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoIcon } from '@monorepo/community-lib';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { HaPageComponent } from '../../../ha-core/ha-component/ha-page/ha-page.component';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import {
  HaCreateIconDtoInput,
  HaIconCreateDialogComponent,
} from '../ha-icon-create-dialog/ha-icon-create-dialog.component';
import { HaIconListComponent } from '../ha-icon-list/ha-icon-list.component';
import { HaSpaceService } from '../../../ha-core/ha-service/ha-space.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ha-icons-page',
  templateUrl: './ha-icons-page.component.html',
  styleUrls: ['./ha-icons-page.component.scss'],
  imports: [HaIconListComponent, TranslatePipe, HaPageComponent],
})
export class HaIconsPageComponent extends HaCommunityPageDirective implements OnInit, OnDestroy {
  private dialogService: FlDialogService = inject(FlDialogService);
  private spaceService = inject(HaSpaceService);

  isGencoveryMember = toSignal(this.spaceService.isGencoveryMember());

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
