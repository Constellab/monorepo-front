import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlServerError } from '@monorepo/front-core-lib/fl-api';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';

import { CaResource } from '../../ca-core/model/entities/folder/ca-resource.class';
import { CaResourceService } from '../../ca-core/service-api/ca-resource.service';

/**
 * Super light page (outside /app, no shell) that redirects to a resource/app.
 * It fetches the resource via XHR (proper auth/space context), shows a loader while the
 * request is in flight, then redirects the current tab to the app url. On failure it renders
 * the error inline instead of a raw JSON page. Meant to be opened in a new tab for apps.
 */
@Component({
  selector: 'ca-resource-redirect-page',
  imports: [FlLoaderModule, FlCoreComponentModule],
  templateUrl: './ca-resource-redirect-page.component.html',
  styleUrl: './ca-resource-redirect-page.component.scss',
})
export class CaResourceRedirectPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private resourceService = inject(CaResourceService);

  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.resourceService.findById(id).subscribe({
      next: (resource) => this.onSuccess(resource),
      error: (error) => this.onError(error),
    });
  }

  private onSuccess(resource: CaResource): void {
    window.location.href = resource.standaloneUrl;
  }

  private onError(error: FlServerError): void {
    this.error.set(error.message);
  }
}
