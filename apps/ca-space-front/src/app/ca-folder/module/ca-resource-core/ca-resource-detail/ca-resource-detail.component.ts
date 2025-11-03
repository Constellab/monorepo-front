import { Component, inject, Injector, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { Observable, switchMap, tap } from 'rxjs';

import { CaHierarchyObjectIconComponent } from '../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { CaRootFolderUserRoleObj } from '../../../../ca-core/model/entities/folder/ca-folder-user.class';
import { CaHierarchyObjectTagDatasource } from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaResource } from '../../../../ca-core/model/entities/folder/ca-resource.class';
import { CaResourceService } from '../../../../ca-core/service-api/ca-resource.service';
import { CaHierarchyObjectEventState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-event.state';
import {
  CaResourceActionEvent,
  CaResourceActionMenu,
} from '../../ca-resource-detail-page/ca-resource-action-menu';

@Component({
  selector: 'ca-resource-detail',
  imports: [
    FlSectionModule,
    CaHierarchyObjectIconComponent,
    FlIconModule,
    FlTranslateModule,
    MatIconButton,
    MatIcon,
    FlDateModule,
    FlFormModule,
    FlTagModule,
  ],
  templateUrl: './ca-resource-detail.component.html',
  styleUrl: './ca-resource-detail.component.scss',
})
export class CaResourceDetailComponent {
  resourceId = input.required<string>();
  userRole = input.required<CaRootFolderUserRoleObj>();
  tags = input<CaHierarchyObjectTagDatasource>();

  private resourceService = inject(CaResourceService);
  private eventState = inject(CaHierarchyObjectEventState, { optional: true });
  private injector = inject(Injector);

  private sanitizer = inject(DomSanitizer);

  // don't use an observable because it breaks the safe url
  url: SafeUrl;

  resource$: Observable<CaResource> = toObservable(this.resourceId).pipe(
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
        userRole: this.userRole(),
      },
      { tags: this.tags() }
    );

    resourceMenu.openActionMenu(event, false).subscribe((event) => this.onResourceEvent(event));
  }

  private onResourceEvent(event: CaResourceActionEvent): void {
    if (this.eventState) {
      this.eventState.emitHierarchyObjectEvent(event);
    }
  }

  renameResource(resource: CaResource, name: string): void {
    this.resourceService.renameResource(resource.id, name).subscribe();
    if (this.eventState) {
      this.eventState.emitRenameEvent(resource.id, resource.getHierarchyObjectType(), name);
    }
  }
}
