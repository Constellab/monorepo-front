import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { HaIconService } from '../../../ha-core/ha-service/ha-icon.service';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlPortalConfig,
  FlPortalService,
} from '@monorepo/front-core-lib';
import { HaIconInfoPortalComponent } from '../ha-icon-info-portal/ha-icon-info-portal.component';
import {
  HaCreateIconDtoInput,
  HaIconCreateDialogComponent,
} from '../ha-icon-create-dialog/ha-icon-create-dialog.component';
import { CoIcon } from '@monorepo/community-lib';
import { CoCommunityLibModule } from '../../../../../../../libs/community-lib/src/lib/co-community-lib.module';

@Component({
  selector: 'ha-icon-list',
  templateUrl: './ha-icon-list.component.html',
  styleUrls: ['./ha-icon-list.component.scss'],
  imports: [CoCommunityLibModule],
})
export class HaIconListComponent implements OnInit, OnDestroy {
  private readonly iconService = inject(HaIconService);
  private readonly portalService = inject(FlPortalService);
  private readonly dialogService = inject(FlDialogService);

  @Input()
  reloadList$: Observable<boolean> = new Observable<boolean>();

  reloadListSubscription: Subscription;

  reloadIcons: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    this.reloadListSubscription = this.reloadList$.subscribe((value: boolean) => {
      this.reloadIcons.next(value);
    });
  }

  ngOnDestroy(): void {
    this.reloadListSubscription.unsubscribe();
  }

  openIconInfoPortal(selectedIcon: [Event, CoIcon]): void {
    let target: Element;
    const event = selectedIcon[0];
    const icon = selectedIcon[1];
    for (let i = 0; i < event.composedPath().length; i++) {
      if ((event.composedPath()[i] as Element).classList.contains('icon-div')) {
        target = event.composedPath()[i] as Element;
        break;
      }
    }
    if (!target) {
      return;
    }
    const config: FlPortalConfig = this.portalService.configureRelativePortal(target, ['bottom', 'top'], {
      hasBackdrop: false,
      disposeOnNavigation: true,
      disposeOnBackdropClick: true,
      transparentBackdrop: true,
      disposeOnOutsideClick: true,
    });

    this.portalService
      .createPortal(HaIconInfoPortalComponent, config, icon)
      .detachments()
      .subscribe((result) => {
        if (result && result.res) {
          if (result.res === 'DELETE') this.openDeleteIconConfirmDialog(icon);
          else if (result.res === 'EDIT') this.openEditIconDialog(icon);
        }
      });
  }

  openEditIconDialog(icon: CoIcon): void {
    const inputData: HaCreateIconDtoInput = {
      mode: 'update',
      object: {
        type: icon.type,
        technicalName: icon.technicalName,
        name: icon.name,
        subNames: icon.subNames.join(','),
        id: icon.id,
        fileName: icon.fileName,
        file: { name: icon.fileName } as File,
      },
    };
    this.dialogService
      .openSmallDialog(HaIconCreateDialogComponent, { data: inputData })
      .afterClosed()
      .subscribe((icon: CoIcon) => {
        if (icon) {
          this.reloadIcons.next(true);
        }
      });
  }

  openDeleteIconConfirmDialog(icon: CoIcon): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_icon',
      successMessage: 'icon_deleted',
      content: 'delete_icon_content',
      observable: this.iconService.delete(icon.id),
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((res: FlConfirmDialogResult) => {
        if (res.choice && res.result) {
          this.reloadIcons.next(true);
        }
      });
  }
}
