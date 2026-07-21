import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy,Component, computed, DOCUMENT, effect, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Params, Router, RouterOutlet } from '@angular/router';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TeHelper } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, map, Subscription } from 'rxjs';

import { HaFile } from '../../../ha-core/entity-module/ha-file-core/model/ha-file';
import { HaEntityPageInfoComponent } from '../../../ha-core/ha-component/ha-entity-page-infos/ha-entity-page-info.component';
import { HaPageComponent } from '../../../ha-core/ha-component/ha-page/ha-page.component';
import { HaBrick, HaEditBrickDTO } from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaEntityType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type';
import { HaUser } from '../../../ha-core/ha-model/ha-entities/ha-user';
import { HaBrickImagePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-brick-image/ha-brick-image.pipe';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaCurrentPageState } from '../../../ha-core/ha-state/ha-current-page.state';
import { HaEntityCommentState } from '../../../ha-core/ha-state/ha-entity-comment.state';
import { HaBrickPageState } from '../../state/ha-brick-page.state';
import { HaBrickSidenavComponent } from '../ha-brick-sidenav/ha-brick-sidenav.component';
import { HaEditBrickDialogComponent } from '../ha-edit-brick-dialog/ha-edit-brick-dialog.component';

@Component({
  selector: 'ha-brick-page',
  templateUrl: './ha-brick-page.component.html',
  styleUrls: ['./ha-brick-page.component.scss'],
  providers: [HaBrickPageState, HaEntityCommentState],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlLoaderModule,
    FlSectionModule,
    FlTextIconModule,
    RouterOutlet,
    HaPageComponent,
    HaEntityPageInfoComponent,
    HaBrickSidenavComponent,
    MatButton,
    MatIcon,
    TranslatePipe,
    NgClass,
    FlCoreComponentModule,
    HaBrickImagePipe,
  ],
})
export class HaBrickPageComponent implements OnInit, OnDestroy {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private brickPageState: HaBrickPageState = inject(HaBrickPageState);
  private router: Router = inject(Router);
  private document: Document = inject(DOCUMENT);
  private authenticatedUserService = inject(HaAuthenticatedUserService);
  private dialogService: FlDialogService = inject(FlDialogService);
  private currentPageState = inject(HaCurrentPageState);

  private navigationEnd = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => true)
    )
  );

  currentUser: Signal<HaUser> = toSignal(this.authenticatedUserService.getUser());
  brick: Signal<HaBrick> = this.brickPageState.brick;
  brickNotFound: Signal<boolean> = this.brickPageState.isBrickError;
  isLoading: Signal<boolean> = this.brickPageState.isBrickLoading;
  tempTitle = this.brickPageState.tempTitle;
  brickCoAuthors = this.brickPageState.coAuthors;
  contributors: Signal<HaUser[]> = computed(() => {
    const coAuthors = this.brickCoAuthors();
    if (!this.brick() || !coAuthors) return [];
    return [this.brick().createdBy, ...coAuthors];
  });
  isAuthor: Signal<boolean> = computed(() => {
    if (!this.currentUser() || !this.brick()) return false;
    return this.currentUser().id === this.brick().createdBy.id;
  });
  userHasEditRight: Signal<boolean> = this.brickPageState.userHasEditRight;
  docHeaders = this.brickPageState.docHeaders;
  docFiles: Signal<HaFile[]> = this.brickPageState.docFiles;
  docFileUrlPrefix: Signal<string> = this.brickPageState.docFileUrlPrefix;
  isDocPage = this.currentPageState.isDocumentationPage;
  lastActivatedRoute = this.currentPageState.lastActivatedRoute;

  isLatestVersion: boolean = true;
  currentVersion: string;
  paramsSubscription: Subscription;

  entityType: HaEntityType = HaEntityType.BRICK;

  constructor() {
    effect(() => {
      if (!this.navigationEnd()) return;
      if (!this.isLatestVersion) {
        this.setLatestBrickCanonicalUrl();
      }
    });
  }

  scrollToHeader(text: string): void {
    TeHelper.scrollToHeader(text);
  }

  ngOnInit(): void {
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.currentVersion = params.version;

      if (params.version != 'latest') {
        // this.metadataService.addMetaTag('robots', 'noindex');
        this.isLatestVersion = false;
        this.setLatestBrickCanonicalUrl();
      } else {
        this.isLatestVersion = true;
      }
      this.brickPageState.init(params.brickName, params.version);
    });
  }

  createEditBrickDialog(): void {
    const node: HaEditBrickDTO = new HaEditBrickDTO();
    node.id = this.brick().id;
    node.description = this.brick().description;
    node.gitRepo = this.brick().gitRepo;
    node.pipRepo = this.brick().pipRepo;
    node.visibility = this.brick().visibility;
    node.credentialUsername = this.brick().credentialUsername;
    node.credentialPassword = this.brick().credentialPassword;
    node.space = this.brick().space;
    node.imageLink = this.brick().imageLink;

    const input: FlFormDialogInput<HaEditBrickDTO> = {
      mode: 'update',
      object: node,
    };

    this.dialogService
      .openMediumDialog(HaEditBrickDialogComponent, { data: input })
      .afterClosed()
      .subscribe((brick) => {
        if (brick) {
          this.brickPageState.setBrick(brick);
        }
      });
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
  }

  private setLatestBrickCanonicalUrl(): void {
    const url = HaRouterService.getFullRoute(this.router.url.replace(`/${this.currentVersion}`, '/latest'));
    let linkCanonical = this.document.querySelector('link[rel="canonical"]');
    if (linkCanonical == null) {
      linkCanonical = this.document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
    }
    linkCanonical.setAttribute('href', url);
    this.document.head.appendChild(linkCanonical);
  }
}
