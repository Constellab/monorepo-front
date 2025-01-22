import { Component, OnInit, inject } from '@angular/core';
import { mergeMap, Observable } from 'rxjs';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { map } from 'rxjs/operators';

/**
 * Page to show preview for document in Iframe (for office documents)
 */
@Component({
  selector: 'ca-document-preview-page',
  templateUrl: './ca-document-preview-page.component.html',
  styleUrl: './ca-document-preview-page.component.scss',
  standalone: false,
})
export class CaDocumentPreviewPageComponent implements OnInit {
  private folderService = inject(CaFolderService);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  documentPreview$: Observable<SafeUrl>;

  ngOnInit(): void {
    this.documentPreview$ = this.route.params.pipe(mergeMap((params) => this.init(params.id)));
  }

  private init(id: string): Observable<SafeUrl> {
    return this.folderService
      .generateDocumentPreview(id)
      .pipe(map((preview) => this.sanitizer.bypassSecurityTrustResourceUrl(preview.previewUrl)));
  }
}
