import {Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {HaIcon, HaIconDatasourcePaginated} from '../../../ha-core/ha-model/ha-entities/ha-icon.class';
import {Subject} from 'rxjs';
import {HaIconService} from '../../../ha-core/ha-service/ha-icon.service';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlPortalConfig,
  FlPortalService
} from '@monorepo/front-core-lib';
import {HaIconInfoPortalComponent} from '../ha-icon-info-portal/ha-icon-info-portal.component';
import {FormControl} from '@ngneat/reactive-forms';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'ha-icon-list',
  templateUrl: './ha-icon-list.component.html',
  styleUrls: ['./ha-icon-list.component.scss']
})
export class HaIconListComponent implements OnInit, OnDestroy {

  @Input()
  reloadList$: Subject<boolean> = new Subject<boolean>();

  icons: HaIconDatasourcePaginated;

  searchFormControl: FormControl<string> = new FormControl('');

  constructor(private readonly iconService: HaIconService,
              private readonly portalService: FlPortalService,
              private readonly dialogService: FlDialogService,
              @Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngOnInit(): void {
    this.loadIcons();

    this.reloadList$.subscribe((value: boolean) => {
      if (value) {
        this.loadIcons();
      }
    });
  }

  loadMoreResults(): void {
    this.icons.getNextPage();
  }

  ngOnDestroy(): void {
    this.reloadList$.unsubscribe();
  }

  private loadIcons(): void {
    if(!isPlatformBrowser(this.platformId)) return;
    this.icons = this.iconService.getAllPaginated();
    this.searchFormControl.patchValue('');
  }

  openIconInfoPortal(event: Event, icon: HaIcon): void{
    let target: Element;
    for (let i = 0; i < event.composedPath().length; i++) {
      if ((event.composedPath()[i] as Element).classList.contains('icon-div')) {
        target = event.composedPath()[i] as Element;
        break;
      }
    }
    if (!target) {
      return;
    }
    const config: FlPortalConfig = this.portalService.configureRelativePortal(target, ['bottom', 'top'],
      {
        hasBackdrop: false,
        disposeOnNavigation: true,
        disposeOnBackdropClick: true,
        transparentBackdrop: true,
        disposeOnOutsideClick: true,
      });

    this.portalService.createPortal(HaIconInfoPortalComponent, config, icon).detachments().subscribe((res) => {
      if (res) {
        this.openDeleteIconConfirmDialog(icon);
      }
    });
  }

  openDeleteIconConfirmDialog(icon: HaIcon): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_icon',
      successMessage: 'icon_deleted',
      content: 'delete_icon_content',
      translateTitleAndContent: true,
      translateMessage: true,
      observable: this.iconService.delete(icon.id)
    }

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe((res: FlConfirmDialogResult) => {
      if(res.choice && res.result){
        this.loadIcons();
      }
    });
  }

  search(): void{
    if (this.searchFormControl.value?.length > 0)
      this.icons = this.iconService.getAllPaginatedFiltered(this.searchFormControl.value);
    else
      this.loadIcons();
  }
}
