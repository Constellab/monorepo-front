import {AfterViewInit, Component, Host, OnDestroy, OnInit} from '@angular/core';
import {FlEmbeddedOptionsAbstractDirective} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {CaBucketCredentials, CaBucketCredentialsDatasource} from '../../../../model/entities/ca-object-storage.class';
import {CaObjectStorageService} from '../../../../service-api/ca-object-storage.service';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'ca-select-bucket-credentials-options',
  templateUrl: './ca-select-bucket-credentials-options.component.html',
  styleUrls: ['./ca-select-bucket-credentials-options.component.scss']
})
export class CaSelectBucketCredentialsOptionsComponent extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit, OnDestroy {

  datasource: CaBucketCredentialsDatasource;
  credentials$: Observable<CaBucketCredentials[]>;


  constructor(private objectStorageService: CaObjectStorageService,
              @Host() private select: MatSelect) {
    super(select);
  }

  ngOnInit(): void {
    this.overrideCompareWithOnIds(this.select);
    this.datasource = this.objectStorageService.getAllCredentialsDatasource();
    this.credentials$ = this.datasource.connect();
  }


  ngAfterViewInit(): void {
    this.initOptions();
  }

  ngOnDestroy(): void {
    this.datasource.disconnect();
  }

}
