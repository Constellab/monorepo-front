import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TdTechnicalDocModule, TdTypeEntity } from '@monorepo/technical-doc';

import { HaRunStatAggregatePanelComponent } from '../../../ha-core/ha-component/ha-run-stat-aggregate-panel/ha-run-stat-aggregate-panel.component';
import { HaBrick } from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaRunStatAggregate } from '../../../ha-core/ha-model/ha-entities/ha-run-stat-aggregate.class';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaBrickPageState } from '../../state/ha-brick-page.state';
import { Ha404Component } from '../../../ha404/ha404.component';

@Component({
  selector: 'ha-public-tech-doc-page',
  templateUrl: './ha-public-tech-doc.component.html',
  styleUrls: ['./ha-public-tech-doc.component.scss'],
  imports: [
    FlLoaderModule,
    TdTechnicalDocModule,
    HaRunStatAggregatePanelComponent,
    FlCoreDirectiveModule,
    Ha404Component,
  ],
})
export class HaPublicTechDocComponent extends HaCommunityPageDirective implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private brickPageState: HaBrickPageState = inject(HaBrickPageState);

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
  runStatAggregate: Signal<HaRunStatAggregate> = this.brickPageState.runStatAggregate;

  url: string;

  ngOnInit(): void {
    this.getActiveDoc();
  }

  private getActiveDoc(): void {
    this.route.params.subscribe((params) => {
      this.brickPageState.initTechDoc(params.brickName, params.version, params.type, params.uniqueName);
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
      null,
      HaRouterService.getFullRoute(this.router.url)
    );
  }
}
