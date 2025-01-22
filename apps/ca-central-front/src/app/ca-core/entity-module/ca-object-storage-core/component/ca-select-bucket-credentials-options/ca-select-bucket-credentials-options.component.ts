import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import {
  CaBucketCredentials,
  CaBucketCredentialsDatasource,
} from '../../../../model/entities/ca-object-storage.class';
import { CaObjectStorageService } from '../../../../service-api/ca-object-storage.service';
import { MatSelect } from '@angular/material/select';
import { FlInfiniteScrollModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-inifite-scroll/fl-infinite-scroll.module';
import { FlCoreDirectiveModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { MatOption } from '@angular/material/core';
import { CaBucketCredentialsInlineComponent } from '../ca-bucket-credentials-inline/ca-bucket-credentials-inline.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ca-select-bucket-credentials-options',
  templateUrl: './ca-select-bucket-credentials-options.component.html',
  styleUrls: ['./ca-select-bucket-credentials-options.component.scss'],
  imports: [
    FlInfiniteScrollModule,
    FlCoreDirectiveModule,
    MatOption,
    CaBucketCredentialsInlineComponent,
    AsyncPipe,
  ],
})
export class CaSelectBucketCredentialsOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements OnInit, AfterViewInit, OnDestroy
{
  private objectStorageService = inject(CaObjectStorageService);
  private select: MatSelect;

  datasource: CaBucketCredentialsDatasource;
  credentials$: Observable<CaBucketCredentials[]>;

  constructor() {
    const select = inject(MatSelect, { host: true });

    super(select);

    this.select = select;
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
