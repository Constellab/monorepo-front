import { Component, OnInit, inject } from '@angular/core';
import { LabBiotaDatabaseSearch } from '../../../../model/lab-biota-database.class';
import { LabBiotaDatabaseService } from '../../../../service/lab-biota-database.service';
import { LabBiotaData, LabBiotaDataDatasource } from '../../../../model/lab-biota-data.class';
import { FlDialogService } from '@monorepo/front-core-lib';
import { LabBiotaDataCardDialogComponent } from '../lab-biota-data-card-dialog/lab-biota-data-card-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { LabBiotaDatabaseSearchFormComponent } from '../../../lab-biota-core/lab-biota-database-search-form/lab-biota-database-search-form.component';
import { FlSectionModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { LabBiotaDatabaseTableComponent } from '../../../lab-biota-core/lab-biota-database-table/lab-biota-database-table.component';
import { FlCoreDirectiveModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { LabBiotaDataCardComponent } from '../lab-biota-data-card/lab-biota-data-card.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-biota-databases',
  templateUrl: './lab-biota-databases.component.html',
  styleUrls: ['./lab-biota-databases.component.scss'],
  imports: [
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    LabBiotaDatabaseSearchFormComponent,
    FlSectionModule,
    LabBiotaDatabaseTableComponent,
    FlCoreDirectiveModule,
    LabBiotaDataCardComponent,
    TranslatePipe,
  ],
})
export class LabBiotaDatabasesComponent implements OnInit {
  private biotaDatabaseService = inject(LabBiotaDatabaseService);
  private dialogService = inject(FlDialogService);
  private breakpointObserver = inject(BreakpointObserver);

  biotaDatasource: LabBiotaDataDatasource;
  columns: string[] = ['id', 'name', 'actions'];

  selectedData: LabBiotaData;

  private readonly hideCardScreenSize: string[] = [Breakpoints.XSmall];

  ngOnInit(): void {}

  onSearch(search: LabBiotaDatabaseSearch): void {
    this.biotaDatasource = this.biotaDatabaseService.searchDatasource(search);
  }

  openDetail(biotaData: LabBiotaData): void {
    this.selectedData = biotaData;
    // if the screen is too small, open detail in dialog
    if (this.breakpointObserver.isMatched(this.hideCardScreenSize)) {
      this.openDetailDialog(biotaData);
    }
  }

  private openDetailDialog(biotaData: LabBiotaData): void {
    this.dialogService.openMediumDialog(LabBiotaDataCardDialogComponent, { data: biotaData });
  }
}
