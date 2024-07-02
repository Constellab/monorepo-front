import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CaProjectService } from '../../../../../ca-core/service-api/ca-project.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { map } from 'rxjs/operators';

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
    this.route.params.subscribe(
      params => this.init(params.documentId)
    );
  }

  private init(id: string): void {
    this.documentPreview$ = this.projectService.generateDocumentPreview(id).pipe(
      map(preview => this.sanitizer.bypassSecurityTrustResourceUrl(preview.previewUrl))
    );
  }
}
