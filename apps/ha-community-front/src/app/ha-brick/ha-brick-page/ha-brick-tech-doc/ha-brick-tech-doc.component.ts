import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  Signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TdTechnicalDocModule, TdTypeEntity } from '@monorepo/technical-doc';

import { Ha404Component } from '../../../ha-404/ha-404/ha-404.component';
import { HaRunStatAggregatePanelComponent } from '../../../ha-core/ha-component/ha-run-stat-aggregate-panel/ha-run-stat-aggregate-panel.component';
import { HaBrick } from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaRunStatAggregate } from '../../../ha-core/ha-model/ha-entities/ha-run-stat-aggregate.class';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaJsonLdState } from '../../../ha-core/ha-state/ha-json-ld.state';
import { HaBrickPageState } from '../../state/ha-brick-page.state';

@Component({
  selector: 'ha-brick-tech-doc-page',
  templateUrl: './ha-brick-tech-doc.component.html',
  styleUrls: ['./ha-brick-tech-doc.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlLoaderModule,
    TdTechnicalDocModule,
    HaRunStatAggregatePanelComponent,
    FlCoreDirectiveModule,
    Ha404Component,
  ],
})
export class HaBrickTechDocComponent extends HaCommunityPageDirective implements OnInit, OnDestroy {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private brickPageState: HaBrickPageState = inject(HaBrickPageState);
  private jsonLdState: HaJsonLdState = inject(HaJsonLdState);

  techDoc: Signal<TdTypeEntity | null> = computed(() => {
    const techDoc = this.brickPageState.techDoc();
    if (techDoc) {
      this.onTechDoc(techDoc);
    }
    return techDoc;
  });
  brick: Signal<HaBrick | null> = this.brickPageState.brick;
  isTechDocLoading: Signal<boolean> = this.brickPageState.isTechDocLoading;
  techDocNotFound: Signal<boolean> = this.brickPageState.isTechDocError;
  runStatAggregate: Signal<HaRunStatAggregate | null> = this.brickPageState.runStatAggregate;

  url: string;

  ngOnInit(): void {
    this.getActiveDoc();
  }

  private getActiveDoc(): void {
    this.route.params.subscribe((params) => {
      this.brickPageState.initTechDoc(params.brickName, params.version, params.type, params.uniqueName);
      this.url = HaRouterService.getTechnicalDocRoute(
        params.brickName,
        params.version,
        params.type,
        params.uniqueName
      );
    });
  }

  private onTechDoc(techDoc: TdTypeEntity): void {
    const brick = this.brick();
    if (brick == null) return;

    super.setMetaTags(
      {
        text: 'ha.techdocumentation.brick.title',
        translateParam: { param: { brickTitle: brick.name, docTitle: techDoc.humanName } },
      },
      {
        text: 'ha.techdocumentation.brick.description',
        translateParam: { param: { brickTitle: brick.name, docTitle: techDoc.humanName } },
      },
      brick.imageLink ?? '',
      HaRouterService.getFullRoute(this.router.url),
      'article'
    );

    this.jsonLdState.setArticleJsonLdContent(
      techDoc.humanName,
      brick.imageLink ? [brick.imageLink] : [],
      brick.createdAt,
      [brick.createdBy]
    );
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.jsonLdState.clearJsonLdContent();
  }
}
