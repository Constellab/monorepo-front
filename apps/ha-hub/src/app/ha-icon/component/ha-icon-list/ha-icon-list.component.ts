import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {HaIcon, HaIconDatasourcePaginated} from '../../../ha-core/ha-model/ha-entities/ha-icon.class';
import {Observable, Subscription} from 'rxjs';
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
import {
  HaCreateIconDtoInput,
  HaIconCreateDialogComponent
} from '../ha-icon-create-dialog/ha-icon-create-dialog.component';

@Component({
  selector: 'ha-icon-list',
  templateUrl: './ha-icon-list.component.html',
  styleUrls: ['./ha-icon-list.component.scss']
})
export class HaIconListComponent implements OnInit, OnDestroy {

  @Input()
  reloadList$: Observable<boolean> = new Observable<boolean>();
  reloadListSubscription: Subscription;
  icons: HaIconDatasourcePaginated;

  searchFormControl: FormControl<string> = new FormControl('');

  constructor(private readonly iconService: HaIconService,
              private readonly portalService: FlPortalService,
              private readonly dialogService: FlDialogService,) {
  }

  ngOnInit(): void {
    this.loadIcons();

    this.reloadListSubscription = this.reloadList$.subscribe((value: boolean) => {
      if (value) {
        this.loadIcons();
      }
    });
  }

  loadMoreResults(): void {
    this.icons.getNextPage();
  }

  ngOnDestroy(): void {
    this.reloadListSubscription.unsubscribe();
  }

  private loadIcons(): void {
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

    this.portalService.createPortal(HaIconInfoPortalComponent, config, icon).detachments().subscribe((result) => {
      if (result && result.res) {
        if (result.res === 'DELETE')
          this.openDeleteIconConfirmDialog(icon);
        else if (result.res === 'EDIT')
          this.openEditIconDialog(icon);
      }
    });
  }

  openEditIconDialog(icon: HaIcon): void {
    const inputData: HaCreateIconDtoInput = {
      mode: 'update',
      object: {
        type: icon.type,
        technicalName: icon.technicalName,
        name: icon.name,
        subNames: icon.subNames.join(','),
        id: icon.id,
        fileName: icon.fileName,
        file: {name: icon.fileName} as File
      }
    }
    this.dialogService.openSmallDialog(HaIconCreateDialogComponent, {data: inputData}).afterClosed().subscribe((icon: HaIcon) => {
      if (icon) {
        this.loadIcons();
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
