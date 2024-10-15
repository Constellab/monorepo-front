import { Component, computed, OnInit, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TdTypeEntity } from '@monorepo/technical-doc';
import { HaMetadataService } from '../../../../ha-core/ha-service/ha-metadata.service';
import { HaBrickPageState } from '../../../state/ha-brick-page.state';
import { HaBrick } from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';

@Component({
  selector: 'ha-public-tech-doc-page',
  templateUrl: './ha-public-tech-doc.component.html',
  styleUrls: ['./ha-public-tech-doc.component.scss'],
})
export class HaPublicTechDocComponent implements OnInit {
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

  constructor(
    private route: ActivatedRoute,
    private metadataService: HaMetadataService,
    private brickPageState: HaBrickPageState
  ) {}

  ngOnInit(): void {
    this.getActiveDoc();
  }

  private getActiveDoc(): void {
    this.route.params.subscribe((params) => {
      this.brickPageState.initTechDoc(params.type, params.uniqueName);
    });
  }

  private onTechDoc(techDoc: TdTypeEntity): void {
    this.metadataService.setPageTitle(
      'ha.techdocumentation.brick.title',
      true,
      { brickTitle: this.brick().name, docTitle: techDoc.humanName }
    );
    this.metadataService.addMetaTag(
      'description',
      'ha.techdocumentation.brick.description',
      true,
      { brickTitle: this.brick().name, docTitle: techDoc.humanName }
    );
  }
}
