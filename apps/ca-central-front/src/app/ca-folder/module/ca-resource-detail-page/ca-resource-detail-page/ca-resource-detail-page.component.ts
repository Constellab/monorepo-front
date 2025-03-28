import { Component, inject, Injector } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { CaResourceService } from '../../../../ca-core/service-api/ca-resource.service';
import { CaResource } from '../../../../ca-core/model/entities/folder/ca-resource.class';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CaResourceActionEvent, CaResourceActionMenu } from '../ca-resource-action-menu';
import { CaHierarchyObjectDetailState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaHierarchyObjectBreadcrumbComponent } from '../../ca-folder-hierarchy-core/component/ca-hierarchy-object-breadcrumb/ca-hierarchy-object-breadcrumb.component';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { CaHierarchyObjectIconComponent } from '../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';

@Component({
  selector: 'ca-resource-detail-page',
  templateUrl: './ca-resource-detail-page.component.html',
  styleUrl: './ca-resource-detail-page.component.scss',
  imports: [
    CaHierarchyObjectBreadcrumbComponent,
    FlSectionModule,
    CaHierarchyObjectIconComponent,
    FlFormModule,
    MatIconButton,
    MatIcon,
    TranslatePipe,
    FlDateModule,
  ],
})
export class CaResourceDetailPageComponent {
  private resourceService = inject(CaResourceService);
  private state = inject(CaHierarchyObjectDetailState);
  private injector = inject(Injector);

  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  // don't use an observable because it breaks the safe url
  url: SafeUrl;

  resource$: Observable<CaResource> = this.route.params.pipe(
    map((params) => params.id),
    switchMap((id) => this.resourceService.findById(id)),
    tap((resource) => {
      // provide the user in iframe url to authenticate the user
      // useful to authenticate the user for dashboard resource
      // this is not the perfect solution, but it works
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(resource.accessUrl);
    })
  );

  openMenu(resource: CaResource, event: MouseEvent): void {
    const resourceMenu = new CaResourceActionMenu(
      this.injector,
      {
        id: resource.id,
        name: resource.name,
      },
      { tags: this.state.getTags() }
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
