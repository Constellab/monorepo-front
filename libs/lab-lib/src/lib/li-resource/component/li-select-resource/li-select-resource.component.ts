import { Component, inject, input, OnInit, output } from '@angular/core';
import {
  FlEntityPaginatedDatasource,
  FlFormFieldDirective,
  FlInputSearchFilter,
} from '@monorepo/front-core-lib/fl-core';
import { LiResource, LiResourceDatasource, LiResourceService } from '@monorepo/lab-lib/li-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlTranslatableText, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { Observable } from 'rxjs';
import { FlInputSearchAdvancedButton, FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { NgControl } from '@angular/forms';
import { ClHelpService } from '@monorepo/core-lib';
import { LiSelectResourceDialogComponent } from '../li-select-resource-dialog/li-select-resource-dialog.component';
import { AsyncPipe } from '@angular/common';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { MatIcon } from '@angular/material/icon';
import { LiResourceInlineComponent } from '../li-resource-inline/li-resource-inline.component';

@Component({
  selector: 'li-select-resource',
  imports: [
    AsyncPipe,
    FlIconModule,
    FlInputSearchModule,
    FlTranslateModule,
    FlUserModule,
    MatIcon,
    LiResourceInlineComponent,
  ],
  templateUrl: './li-select-resource.component.html',
  styleUrl: './li-select-resource.component.scss',
})
export class LiSelectResourceComponent extends FlFormFieldDirective<LiResource> implements OnInit {
  private resourceService = inject(LiResourceService);
  private dialogService = inject(FlDialogService);

  placeholder = input<FlTranslatableText>('li.resource_select');

  resourceChange = output<LiResource>();
  openDialog = output();

  selectedResource: LiResource | Observable<LiResource>;

  datasource: LiResourceDatasource<FlInputSearchFilter>;

  advancedButton: FlInputSearchAdvancedButton<LiResource>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => {
        const nameSearch = data.filtersCriteria.searchText;
        // set a default search
        if (ClHelpService.isNullOrEmpty(nameSearch)) {
          return this.resourceService.advancedSearch(page, pageSize, null);
        }
        return this.resourceService.searchByName(data.filtersCriteria.searchText, page, pageSize);
      },
      20,
      { initFirstPage: false }
    );

    this.advancedButton = {
      onClick: () => {
        this.openDialog.emit();
        return this.dialogService.openBigDialog(LiSelectResourceDialogComponent).afterClosed();
      },
    };
  }

  writeValue(obj: LiResource): void {
    if (obj == null) {
      this.selectedResource = null;
      this.value = null;
      return;
    }

    // if the provided object is not an instance of LiResource, load it from the api
    if (obj instanceof LiResource) {
      this.selectedResource = obj;
    } else if (typeof obj == 'string') {
      this.selectedResource = this.resourceService.getById(obj);
    } else if ((obj as any).id != null) {
      this.selectedResource = this.resourceService.getById((obj as any).id);
    }
    this.value = obj;
  }

  callChangeEvent(value: LiResource): void {
    this.resourceChange.emit(value);
    this.selectedResource = value;
  }

  onDisableChange(): void {}
}
