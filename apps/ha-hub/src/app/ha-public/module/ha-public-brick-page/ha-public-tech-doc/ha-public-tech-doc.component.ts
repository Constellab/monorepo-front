import { Component, computed, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TdTypeEntity } from '@monorepo/technical-doc';
import { HaMetadataService } from '../../../../ha-core/ha-service/ha-metadata.service';
import { HaBrickPageState } from '../../../state/ha-brick-page.state';
import { HaBrick } from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaRouterService } from '../../../../ha-core/ha-service/ha-router.service';
import { HaCommunityPage } from '../../../../ha-core/utils/ha-community.page';
import { FlTranslateService } from '@monorepo/front-core-lib';

@Component({
  selector: 'ha-public-tech-doc-page',
  templateUrl: './ha-public-tech-doc.component.html',
  styleUrls: ['./ha-public-tech-doc.component.scss'],
})
export class HaPublicTechDocComponent extends HaCommunityPage implements OnInit {
  techDoc: Signal<TdTypeEntity> = computed(() => {
    const techDoc = this.brickPageState.techDoc();
    if (techDoc) {
      this.onTechDoc(techDoc);
    }
    return techDoc;
  });
  brick: Signal<HaBrick> = this.brickPageState.brick;
  isTechDocLoading: Signal<boolean> = this.brickPageState.isTechDocLoading;
  techDocNotFound: Signal<boolean> = this.brickPageState.isTechDocError;

  url: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private brickPageState: HaBrickPageState,
    translateService: FlTranslateService,
    metadataService: HaMetadataService
  ) {
    super(translateService, metadataService);
  }

  ngOnInit(): void {
    this.getActiveDoc();
  }

  private getActiveDoc(): void {
    this.route.params.subscribe((params) => {
      this.brickPageState.initTechDoc(params.briockName, params.version, params.type, params.uniqueName);
      this.url = HaRouterService.getTechnicalDocRoute(
        params.briockName,
        params.version,
        params.type,
        params.uniqueName
      );
    });
  }

  private onTechDoc(techDoc: TdTypeEntity): void {
    this.metadataService.setPageTitle('ha.techdocumentation.brick.title', true, {
      brickTitle: this.brick().name,
      docTitle: techDoc.humanName,
    });
    this.metadataService.addMetaTag('description', 'ha.techdocumentation.brick.description', true, {
      brickTitle: this.brick().name,
      docTitle: techDoc.humanName,
    });
    this.metadataService.setSocialMetaTags(techDoc.humanName, techDoc.doc, null, this.url);

    super.setMetaTags(
      {
        text: 'ha.techdocumentation.brick.title',
        translateParam: { param: { brickTitle: this.brick().name, docTitle: techDoc.humanName } },
      },
      {
        text: 'ha.techdocumentation.brick.description',
        translateParam: { param: { brickTitle: this.brick().name, docTitle: techDoc.humanName } },
      },
      this.brick().imageLink,
      HaRouterService.getFullRoute(this.router.url)
    );
  }
}
