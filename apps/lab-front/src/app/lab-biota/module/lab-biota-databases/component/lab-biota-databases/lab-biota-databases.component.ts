import {Component, OnInit} from '@angular/core';
import {LabBiotaDatabaseSearch} from '../../../../model/lab-biota-database.class';
import {LabBiotaDatabaseService} from '../../../../service/lab-biota-database.service';
import {LabBiotaData, LabBiotaDataDatasource} from '../../../../model/lab-biota-data.class';
import {FlDialogService} from '@monorepo/front-core-lib';
import {LabBiotaDataCardDialogComponent} from '../lab-biota-data-card-dialog/lab-biota-data-card-dialog.component';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'lab-biota-databases',
  templateUrl: './lab-biota-databases.component.html',
  styleUrls: ['./lab-biota-databases.component.scss']
})
export class LabBiotaDatabasesComponent implements OnInit {

  biotaDatasource: LabBiotaDataDatasource;
  columns: string[] = ['id', 'name', 'actions'];

  selectedData: LabBiotaData;

  private readonly hideCardScreenSize: string[] = [Breakpoints.XSmall];

  constructor(private biotaDatabaseService: LabBiotaDatabaseService,
              private dialogService: FlDialogService,
              private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
  }

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
    this.dialogService.openMediumDialog(LabBiotaDataCardDialogComponent, {data: biotaData});
  }
}
