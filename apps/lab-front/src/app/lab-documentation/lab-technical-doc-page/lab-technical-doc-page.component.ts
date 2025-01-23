import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LabTypeEntity } from '../../lab-core/model/entities/lab-type/lab-type.entity';
import { mergeMap, Observable } from 'rxjs';
import { LabTypeService } from '../../lab-core/entity-service/lab-type.service';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlArticleModule } from '@monorepo/front-core-lib/fl-article';
import { TdTechnicalDocModule } from '../../../../../../libs/technical-doc/src/lib/td-technical-doc.module';
import { LabTypeDetailComponent } from '../../lab-core/entity-module/lab-type-core/component/lab-type-detail/lab-type-detail.component';

@Component({
  selector: 'lab-technical-doc-page',
  templateUrl: './lab-technical-doc-page.component.html',
  styleUrls: ['./lab-technical-doc-page.component.scss'],
  imports: [
    FlSectionModule,
    FlCoreDirectiveModule,
    CdkScrollable,
    FlArticleModule,
    TdTechnicalDocModule,
    LabTypeDetailComponent,
  ],
})
export class LabTechnicalDocPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private typeService = inject(LabTypeService);

  type$: Observable<LabTypeEntity>;

  ngOnInit(): void {
    this.type$ = this.route.params.pipe(
      mergeMap((params) => {
        return this.typeService.getTyping(params.typingName.replaceAll('-', '.'));
      })
    );
  }
}
