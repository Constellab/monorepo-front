import {Component, OnDestroy} from '@angular/core';
import {FlDialogService} from '@monorepo/front-core-lib';
import {Subject} from 'rxjs';
import {
  HaCreateIconDtoInput,
  HaIconCreateDialogComponent
} from '../ha-icon-create-dialog/ha-icon-create-dialog.component';
import { CoIcon } from '@monorepo/community-lib';

@Component({
  selector: 'ha-icons-page',
  templateUrl: './ha-icons-page.component.html',
  styleUrls: ['./ha-icons-page.component.scss']
})
export class HaIconsPageComponent implements OnDestroy{

  reloadList$ = new Subject<boolean>();

  constructor(private dialogService: FlDialogService) {
  }

  openCreateIconDialog(): void {
    const inputData: HaCreateIconDtoInput = {
      mode: 'create',
      object: null
    }
    this.dialogService.openSmallDialog(HaIconCreateDialogComponent, {data: inputData}).afterClosed().subscribe((icon: CoIcon) => {
      if (icon) {
        this.reloadList$.next(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.reloadList$.complete();
  }
}
