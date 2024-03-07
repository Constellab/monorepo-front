import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {HaIconDatasourcePaginated} from '../../../ha-core/ha-model/ha-entities/ha-icon.class';
import {Observable, of, Subject} from 'rxjs';
import {HaIconService} from '../../../ha-core/ha-service/ha-icon.service';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {HaApiServiceConfig} from '../../../ha-core/ha-model/ha-config/ha-api-module.config';

@Component({
  selector: 'ha-icon-list',
  templateUrl: './ha-icon-list.component.html',
  styleUrls: ['./ha-icon-list.component.scss']
})
export class HaIconListComponent implements OnInit, OnDestroy {

  @Input()
  reloadList$: Subject<boolean> = new Subject<boolean>();

  icons: HaIconDatasourcePaginated;

  constructor(private readonly iconService: HaIconService,
              private readonly apiServiceConfig: HaApiServiceConfig,
              private iconRegistry: MatIconRegistry) {
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

  getIconSvg(technicalName: string): string{

    return technicalName;
  }

  getIconFileUrl(technicalName: string): string {
    return this.apiServiceConfig.getApiUrl() + 'icon/file/' + technicalName;
  }

  ngOnDestroy(): void {
    this.reloadList$.unsubscribe();
  }

  private loadIcons(): void {
    this.icons = this.iconService.getAllPaginated();
    console.log(this.icons.array)
  }
}
