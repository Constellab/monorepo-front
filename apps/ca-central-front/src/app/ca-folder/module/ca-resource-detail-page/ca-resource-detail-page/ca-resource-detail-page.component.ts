import { Component, inject } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { CaResourceService } from '../../../../ca-core/service-api/ca-resource.service';
import { CaResource } from '../../../../ca-core/model/entities/folder/ca-resource.class';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CaResourceActionEvent, CaResourceActionMenu } from '../ca-resource-action-menu';
import { FlDialogService, FlMenuDynamicService } from '@monorepo/front-core-lib';
import { CaHierarchyObjectDetailState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';

@Component({
    selector: 'ca-resource-detail-page',
    templateUrl: './ca-resource-detail-page.component.html',
    styleUrl: './ca-resource-detail-page.component.scss',
    standalone: false
})
export class CaResourceDetailPageComponent {
  private resourceService = inject(CaResourceService);
  private menuDynamicService = inject(FlMenuDynamicService);
  private dialogService = inject(FlDialogService);
  private state = inject(CaHierarchyObjectDetailState);

  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  // don't use an observable because it breaks the safe url
  url: SafeUrl;

  resource$: Observable<CaResource> = this.route.params.pipe(
    map((params) => params.id),
    switchMap((id) => this.resourceService.findById(id)),
    tap((resource) => (this.url = this.sanitizer.bypassSecurityTrustResourceUrl(resource.shareLink)))
  );

  openMenu(resource: CaResource, event: MouseEvent): void {
    const resourceMenu = new CaResourceActionMenu(
      this.resourceService,
      this.menuDynamicService,
      this.dialogService,
      {
        id: resource.id,
        name: resource.name,
        shareLink: resource.shareLink,
      }
    );

    resourceMenu.openActionMenu(event).subscribe((action) => this.onMenuAction(action));
  }

  private onMenuAction(action: CaResourceActionEvent): void {
    if (action.action === 'deleteResource') {
      this.state.navigateToParentFolder();
    }
  }

  renameResource(resource: CaResource, name: string): void {
    this.resourceService.renameResource(resource.id, name).subscribe();
  }
}
