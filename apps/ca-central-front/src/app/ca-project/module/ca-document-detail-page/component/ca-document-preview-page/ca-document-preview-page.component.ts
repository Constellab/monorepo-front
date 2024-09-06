import { Component, OnInit } from '@angular/core';
import { mergeMap, Observable } from 'rxjs';
import { CaProjectService } from '../../../../../ca-core/service-api/ca-project.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { map } from 'rxjs/operators';

/**
 * Page to show preview for document in Iframe (for office documents)
 */
@Component({
  selector: 'ca-document-preview-page',
  templateUrl: './ca-document-preview-page.component.html',
  styleUrl: './ca-document-preview-page.component.scss'
})
export class CaDocumentPreviewPageComponent implements OnInit {

  documentPreview$: Observable<SafeUrl>;

  constructor(private projectService: CaProjectService,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.documentPreview$ = this.route.params.pipe(
      mergeMap(params => this.init(params.id))
    );
  }

  private init(id: string): Observable<SafeUrl> {
    return this.projectService.generateDocumentPreview(id).pipe(
      map(preview => this.sanitizer.bypassSecurityTrustResourceUrl(preview.previewUrl))
    );
  }
}
