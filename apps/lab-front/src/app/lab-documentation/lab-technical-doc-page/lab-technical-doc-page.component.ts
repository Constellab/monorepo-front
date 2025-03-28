import { ActivatedRoute } from '@angular/router';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, OnInit, inject } from '@angular/core';
import { FlArticleModule } from '@monorepo/front-core-lib/fl-article';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiTypeDetailComponent } from '@monorepo/lab-lib/li-type';
import { LiTypeEntity, LiTypeService } from '@monorepo/lab-lib/li-core';
import { Observable, mergeMap } from 'rxjs';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';

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
    LiTypeDetailComponent,
  ],
})
export class LabTechnicalDocPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private typeService = inject(LiTypeService);

  type$: Observable<LiTypeEntity>;

  ngOnInit(): void {
    this.type$ = this.route.params.pipe(
      mergeMap((params) => {
        return this.typeService.getTyping(params.typingName.replaceAll('-', '.'));
      })
    );
  }
}
