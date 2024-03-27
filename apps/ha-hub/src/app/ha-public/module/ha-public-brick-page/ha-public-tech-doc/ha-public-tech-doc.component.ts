import {Component, Inject, makeStateKey, OnInit, PLATFORM_ID, StateKey, TransferState} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HaBrickService} from '../../../../ha-core/ha-service/ha-brick.service';
import {TdBrick, TdTypeEntity} from '@monorepo/technical-doc';
import {HaMetadataService} from '../../../../ha-core/ha-service/ha-metadata.service';

import {isPlatformBrowser, isPlatformServer} from '@angular/common';

@Component({
  selector: 'ha-public-tech-doc-page',
  templateUrl: './ha-public-tech-doc.component.html',
  styleUrls: ['./ha-public-tech-doc.component.scss'],
})
export class HaPublicTechDocComponent implements OnInit {

  techDoc: TdTypeEntity;
  brickName: string;
  brickVersion: string;
  isLoading: boolean = true;
  techDocNotFound: boolean = false;

  TECH_DOC_KEY: StateKey<object>;

  constructor(
    private brickService: HaBrickService,
    private route: ActivatedRoute,
    private router: Router,
    private metadataService: HaMetadataService,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: object) {
  }

  ngOnInit(): void {
    this.TECH_DOC_KEY = makeStateKey<object>('techDoc');
    this.getActiveDoc();
  }

  private getActiveDoc(): void {
    if (this.router.url.includes('tech-doc') || this.router.url.includes('product-doc')) {
      this.brickName = this.router.url.includes('tech-doc') ? TdBrick.GWS_CORE : TdBrick.GWS_ACADEMY;
      this.brickVersion = 'latest';
    }
    this.route.params.subscribe(params => {

      this.brickName = this.brickName ?? params.brickName;
      this.brickVersion = this.brickVersion ?? params.version;

      if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.TECH_DOC_KEY)) {
        this.onTechDoc(this.transferState.get(this.TECH_DOC_KEY, null as any) as TdTypeEntity);
        this.transferState.remove(this.TECH_DOC_KEY);
        return;
      }

      this.techDocNotFound = false;
      this.isLoading = true;

      this.brickService.getTechDocByPath(this.brickName, this.brickVersion,
        params.type, params.uniqueName).subscribe(techDoc => {
        if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.TECH_DOC_KEY)) {
          this.transferState.set(this.TECH_DOC_KEY, techDoc);
        }
        this.onTechDoc(techDoc);
      });
    });
  }

  private onTechDoc(techDoc: TdTypeEntity): void {
    if (techDoc == null) {
      this.techDocNotFound = true;
    }
    this.techDoc = techDoc;
    this.isLoading = false;
    this.metadataService.setPageTitle('ha.techdocumentation.brick.title',
      true, {brickTitle: this.brickName, docTitle: this.techDoc.humanName});
    this.metadataService.addMetaTag('description', 'ha.techdocumentation.brick.description',
      true, {brickTitle: this.brickName, docTitle: this.techDoc.humanName});
  }
}
