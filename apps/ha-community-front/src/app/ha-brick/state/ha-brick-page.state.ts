import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  computed,
  inject,
  Injectable,
  makeStateKey,
  PLATFORM_ID,
  Signal,
  signal,
  StateKey,
  TransferState,
} from '@angular/core';
import { UrlSegment } from '@angular/router';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlStatusEvent } from '@monorepo/front-core-lib/fl-core';
import { TdTypeEntity } from '@monorepo/technical-doc';
import { TeBlockHeaderData, TeBlockHeaderLevel } from '@monorepo/text-editor';
import { plainToInstance } from 'class-transformer';
import { first } from 'rxjs';

import { HaFile } from '../../ha-core/entity-module/ha-file-core/model/ha-file';
import { HaBrick } from '../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaBrickVersion } from '../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import { HaDocumentation } from '../../ha-core/ha-model/ha-entities/ha-documentation.class';
import {
  HaRunStatAggregate,
  HaRunStatAggregateObjectType,
} from '../../ha-core/ha-model/ha-entities/ha-run-stat-aggregate.class';
import { HaUser } from '../../ha-core/ha-model/ha-entities/ha-user';
import { HaReferenceDTO } from '../../ha-core/ha-model/ha-entities/ha-version.class';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { HaBrickService } from '../../ha-core/ha-service/ha-brick.service';
import { HaBrickVersionService } from '../../ha-core/ha-service/ha-brick-version.service';
import { HaDocumentationService } from '../../ha-core/ha-service/ha-documentation.service';
import { HaHttpRedirectionService } from '../../ha-core/ha-service/ha-http-redirection.service';
import { HaRouterService } from '../../ha-core/ha-service/ha-router.service';
import { HaRunStatAggregateService } from '../../ha-core/ha-service/ha-run-stat-aggregate.service';

@Injectable()
export class HaBrickPageState {
  private platformId = inject(PLATFORM_ID);
  private transferState = inject(TransferState);
  private brickService = inject(HaBrickService);
  private brickVersionService = inject(HaBrickVersionService);
  private documentationService = inject(HaDocumentationService);
  private httpRedirectionService = inject(HaHttpRedirectionService);
  private runStatAggregateService = inject(HaRunStatAggregateService);
  private authenticatedUserService = inject(HaAuthenticatedUserService);

  private BRICK_KEY: StateKey<object> = makeStateKey<HaBrick>('brick');
  private LATEST_BRICK_VERSION_KEY: StateKey<object> = makeStateKey<HaBrick>('latest-brick-version');
  private DOC_KEY: StateKey<object> = makeStateKey<HaDocumentation>('doc');
  private TECH_DOC_KEY: StateKey<object> = makeStateKey<object>('techDoc');
  private CO_AUTHORS_KEY: StateKey<object> = makeStateKey<object>('co-authors');
  private DIRECT_REFERENCES_KEY: StateKey<object> = makeStateKey<object>('direct-references');
  private BRICK_RUN_STAT_KEY: StateKey<object> = makeStateKey<object>('brick-run-stat');
  private DOC_FILES_KEY: StateKey<object> = makeStateKey<object>('doc-files');

  // --- Writable signals (private) ---
  private _pathVersion = signal<string>(null);
  private _userHasEditRight = signal<boolean>(null);
  private _docFileUrlPrefix = signal<string>(null);
  private _docFiles = signal<HaFile[]>(null);
  private _tempTitle = signal<string>('');
  private _coAuthors = signal<HaUser[]>(null);
  private _directReferences = signal<HaReferenceDTO[]>(null);

  private brickStatusEvent = signal<FlStatusEvent<HaBrick>>(null);
  private latestBrickVersionStatusEvent = signal<FlStatusEvent<HaBrickVersion>>(null);
  private docStatusEvent = signal<FlStatusEvent<HaDocumentation>>(null);
  private brickRunStatAggregateStatusEvent = signal<FlStatusEvent<HaRunStatAggregate>>(null);
  private runStatAggregateStatusEvent = signal<FlStatusEvent<HaRunStatAggregate>>(null);
  private techDocStatusEvent = signal<FlStatusEvent<TdTypeEntity>>(null);

  // --- Public readonly signals ---
  readonly pathVersion: Signal<string> = this._pathVersion.asReadonly();
  readonly userHasEditRight: Signal<boolean> = this._userHasEditRight.asReadonly();
  readonly docFileUrlPrefix: Signal<string> = this._docFileUrlPrefix.asReadonly();
  readonly docFiles: Signal<HaFile[]> = this._docFiles.asReadonly();
  readonly tempTitle: Signal<string> = this._tempTitle.asReadonly();
  readonly coAuthors: Signal<HaUser[]> = this._coAuthors.asReadonly();
  readonly directReferences: Signal<HaReferenceDTO[]> = this._directReferences.asReadonly();

  // --- Computed signals ---
  readonly brickAndPathVersion: Signal<[HaBrick, string]> = computed(() => {
    return [this.brick(), this.pathVersion()];
  });

  readonly isBrickLoading: Signal<boolean> = computed(() => {
    return this.brickStatusEvent() && this.brickStatusEvent().status === 'loading';
  });

  readonly isBrickError: Signal<boolean> = computed(() => {
    return this.brickStatusEvent() && this.brickStatusEvent().status === 'error';
  });

  readonly brick: Signal<HaBrick> = computed(() => {
    const brickStatusEvent = this.brickStatusEvent();
    if (brickStatusEvent && brickStatusEvent.status === 'success') {
      return brickStatusEvent.object;
    }
    return null;
  });

  readonly latestBrickVersion: Signal<HaBrickVersion> = computed(() => {
    const latestBrickVersionStatusEvent = this.latestBrickVersionStatusEvent();
    if (latestBrickVersionStatusEvent && latestBrickVersionStatusEvent.status === 'success') {
      return latestBrickVersionStatusEvent.object;
    }
    return null;
  });

  readonly isDocLoading: Signal<boolean> = computed(() => {
    return this.docStatusEvent() && this.docStatusEvent().status === 'loading';
  });

  readonly isDocError: Signal<boolean> = computed(() => {
    return this.docStatusEvent() && this.docStatusEvent().status === 'error';
  });

  readonly doc: Signal<HaDocumentation> = computed(() => {
    const docStatusEvent = this.docStatusEvent();
    if (docStatusEvent && docStatusEvent.status === 'success') {
      return docStatusEvent.object;
    }
    return null;
  });

  readonly isTechDocLoading: Signal<boolean> = computed(() => {
    return this.techDocStatusEvent() && this.techDocStatusEvent().status === 'loading';
  });

  readonly isTechDocError: Signal<boolean> = computed(() => {
    return this.techDocStatusEvent() && this.techDocStatusEvent().status === 'error';
  });

  readonly techDoc: Signal<TdTypeEntity> = computed(() => {
    const techDocStatusEvent = this.techDocStatusEvent();
    if (techDocStatusEvent && techDocStatusEvent.status === 'success') {
      return techDocStatusEvent.object;
    }
    return null;
  });

  readonly brickRunStatAggregate: Signal<HaRunStatAggregate> = computed(() => {
    const brickRunStatAggregateStatusEvent = this.brickRunStatAggregateStatusEvent();
    if (brickRunStatAggregateStatusEvent && brickRunStatAggregateStatusEvent.status === 'success') {
      return brickRunStatAggregateStatusEvent.object;
    }
    return null;
  });

  readonly runStatAggregate: Signal<HaRunStatAggregate> = computed(() => {
    const runStatAggregateStatusEvent = this.runStatAggregateStatusEvent();
    if (runStatAggregateStatusEvent && runStatAggregateStatusEvent.status === 'success') {
      return runStatAggregateStatusEvent.object;
    }
    return null;
  });

  readonly docHeaders: Signal<TeBlockHeaderData[]> = computed(() => {
    if (!this.doc()?.content) return [];
    return this.doc().content?.getHeadersData([TeBlockHeaderLevel.HEADER_1, TeBlockHeaderLevel.HEADER_2]);
  });

  // --- Public methods ---

  public init(brickName: string, version: string): void {
    if (!this.isValidVersion(version)) {
      this.brickStatusEvent.set({ status: 'error', error: 'invalid_version' });
      return;
    }
    this._pathVersion.set(version);
    this._tempTitle.set(ClStringHelper.fromKebabCaseToSentence(brickName));
    this.initBrick(brickName);
  }

  public setBrick(brick: HaBrick): void {
    if (brick == null || brick.id == null) {
      this.brickStatusEvent.set({ status: 'error', error: 'brick_not_found' });
      return;
    }
    this.brickStatusEvent.set({ status: 'success', object: brick });

    this.initBrickRunStatAggregate(brick.id);
    this.initCoAuthors(brick.id);
  }

  public initDoc(docId: string, url: UrlSegment[], brick: HaBrick): void {
    if (this.doc() && this.doc().id === docId) {
      return;
    }

    // Non-UUID docId requires brick for redirect logic — skip until brick is loaded
    if (!ClStringHelper.isUUID(docId)) {
      if (!brick) return;

      this.docStatusEvent.set({ status: 'loading' });
      if (url.length == 1 && url[0].path == 'getting-started') {
        this.redirectToGettingStartedDoc(brick);
        return;
      }

      this.redirectToCompletePathDoc(url);
      return;
    }

    // UUID docId — can load immediately without brick
    this.docStatusEvent.set({ status: 'loading' });
    this.initDocFileUrlPrefix(docId);
    this.initDocFiles(docId);

    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.DOC_KEY)) {
      this.setDoc(plainToInstance(HaDocumentation, this.transferState.get(this.DOC_KEY, null)));
      this.transferState.remove(this.DOC_KEY);
      return;
    }

    this.documentationService.getById(docId).subscribe({
      next: (doc) => {
        if (url.slice(0, -1).join('/') + '/' != doc.completePath && this.brick() && this.pathVersion()) {
          const realDocUrl = HaRouterService.getDocumentationRoute(
            this.brick().name,
            this.pathVersion(),
            doc.completePath,
            doc.id
          );
          this.httpRedirectionService.redirectTo(realDocUrl);
        }

        this.setDoc(doc);
        if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.DOC_KEY)) {
          this.transferState.set(this.DOC_KEY, doc);
        }
      },
      error: (error) => {
        this.docStatusEvent.set({ status: 'error', error: error });
      },
    });
  }

  public setDoc(doc: HaDocumentation): void {
    if (doc == null || doc.id == null) {
      this.docStatusEvent.set({ status: 'error', error: 'doc_not_found' });
      return;
    }

    this.docStatusEvent.set({ status: 'success', object: doc });
  }

  public initTechDoc(
    brickName: string,
    version: string,
    techDocType: string,
    techDocUniqueName: string
  ): void {
    if (!this.isValidVersion(version)) {
      this.techDocStatusEvent.set({ status: 'error', error: 'invalid_version' });
      return;
    }

    this.techDocStatusEvent.set({ status: 'loading' });

    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.TECH_DOC_KEY)) {
      this.setTechDoc(this.transferState.get(this.TECH_DOC_KEY, null) as TdTypeEntity);
      this.transferState.remove(this.TECH_DOC_KEY);
      return;
    }

    this.brickService.getTechDocByPath(brickName, version, techDocType, techDocUniqueName).subscribe({
      next: (techDoc) => {
        if (!techDoc) {
          this.techDocStatusEvent.set({ status: 'error', error: 'tech_doc_not_found' });
          return;
        }
        this.setTechDoc(techDoc);
        if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.TECH_DOC_KEY)) {
          this.transferState.set(this.TECH_DOC_KEY, techDoc);
        }
      },
      error: (error) => {
        this.techDocStatusEvent.set({ status: 'error', error: error });
      },
    });
  }

  // --- Private methods ---

  private isValidVersion(version: string): boolean {
    if (!version) return false;
    return version === 'latest' || /^v\d+\.\d+\.\d+(-beta\.\d+)?$/.test(version);
  }

  private initCoAuthors(brickId: string): void {
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.CO_AUTHORS_KEY)) {
      this._coAuthors.set(this.transferState.get(this.CO_AUTHORS_KEY, null) as HaUser[]);
      this.transferState.remove(this.CO_AUTHORS_KEY);
      return;
    }

    this.brickService.getCoAuthors(brickId).subscribe((coAuthors) => {
      this._coAuthors.set(coAuthors);
      if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.CO_AUTHORS_KEY)) {
        this.transferState.set(this.CO_AUTHORS_KEY, coAuthors);
      }
    });
  }

  private setLatestBrickVersion(brickVersion: HaBrickVersion): void {
    if (brickVersion == null || brickVersion.id == null) {
      this.latestBrickVersionStatusEvent.set({
        status: 'error',
        error: 'brick_version_not_found',
      });
      return;
    }

    this.latestBrickVersionStatusEvent.set({
      status: 'success',
      object: brickVersion,
    });
    this.initBrickVersionDirectReferences(brickVersion.id);
  }

  private redirectToGettingStartedDoc(brick: HaBrick): void {
    this.brickService
      .getBrickGettingStarted(this.brick()?.name ?? brick?.name, this.pathVersion())
      .subscribe((doc) => {
        if (doc) {
          this.httpRedirectionService.redirectTo(
            HaRouterService.getDocumentationRoute(
              this.brick().name,
              this.pathVersion(),
              doc.completePath,
              doc.id
            )
          );
        }
      });
  }

  private initUserHasEditRight(brick: HaBrick): void {
    this.authenticatedUserService.getUser().pipe(first()).subscribe((user: HaUser) => {
      if (user) {
        this.checkUserRights(brick);
      } else {
        this._userHasEditRight.set(false);
      }
    });
  }

  private checkUserRights(brick: HaBrick): void {
    this.brickService.checkUserRights(brick.id, false).subscribe((res) => {
      this._userHasEditRight.set(res);
    });
  }

  private initBrick(name: string): void {
    this.brickStatusEvent.set({ status: 'loading' });

    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.BRICK_KEY)) {
      this.onInitBrick(this.transferState.get(this.BRICK_KEY, null) as HaBrick);
      this.transferState.remove(this.BRICK_KEY);
      return;
    }

    this.brickService.getByName(name).subscribe({
      next: (brick) => {
        this.onInitBrick(brick);
        if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.BRICK_KEY)) {
          this.transferState.set(this.BRICK_KEY, brick);
        }
      },
      error: (error) => {
        this.brickStatusEvent.set({ status: 'error', error: error });
      },
    });
  }

  private onInitBrick(brick: HaBrick): void {
    this.setBrick(brick);
    this.initLatestBrickVersion(brick);
    this.initUserHasEditRight(brick);
  }

  private initLatestBrickVersion(brick: HaBrick): void {
    this.latestBrickVersionStatusEvent.set({ status: 'loading' });
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.LATEST_BRICK_VERSION_KEY)) {
      const latestBrickVersion = this.transferState.get(
        this.LATEST_BRICK_VERSION_KEY,
        null
      ) as HaBrickVersion;
      this.transferState.remove(this.LATEST_BRICK_VERSION_KEY);
      if (latestBrickVersion && latestBrickVersion.id) {
        this.setLatestBrickVersion(HaBrickVersion.initInstance(latestBrickVersion));
      }
      return;
    }

    this.brickService.getLastVersion(brick?.name).subscribe({
      next: (brickVersion: HaBrickVersion) => {
        this.setLatestBrickVersion(brickVersion);
        if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.LATEST_BRICK_VERSION_KEY)) {
          this.transferState.set(this.LATEST_BRICK_VERSION_KEY, brickVersion);
        }
      },
      error: (error) => {
        this.latestBrickVersionStatusEvent.set({
          status: 'error',
          error: error,
        });
      },
    });
  }

  private initBrickVersionDirectReferences(brickVersionId: string): void {
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.DIRECT_REFERENCES_KEY)) {
      this._directReferences.set(this.transferState.get(this.DIRECT_REFERENCES_KEY, null) as HaReferenceDTO[]);
      this.transferState.remove(this.DIRECT_REFERENCES_KEY);
      return;
    }

    this.brickVersionService.getDirectReferences(brickVersionId).subscribe((res) => {
      this._directReferences.set(res);
      if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.DIRECT_REFERENCES_KEY)) {
        this.transferState.set(this.DIRECT_REFERENCES_KEY, res);
      }
    });
  }

  private initDocFileUrlPrefix(docId: string): void {
    this._docFileUrlPrefix.set(this.documentationService.getDocFilePrefix(docId));
  }

  private initDocFiles(docId: string): void {
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.DOC_FILES_KEY)) {
      this._docFiles.set(this.transferState.get(this.DOC_FILES_KEY, null) as HaFile[]);
      this.transferState.remove(this.DOC_FILES_KEY);
      return;
    }

    this.documentationService.getDocFiles(docId).subscribe({
      next: (docFiles) => {
        this._docFiles.set(docFiles);
        if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.DOC_FILES_KEY)) {
          this.transferState.set(this.DOC_FILES_KEY, docFiles);
        }
      },
      error: (error) => {
        this.docStatusEvent.set({ status: 'error', error: error });
      },
    });
  }

  private redirectToCompletePathDoc(url: UrlSegment[]): void {
    const currentUrl = url.join('/');
    const completePath = url.map((segment) => segment.path).join('/');
    this.documentationService
      .getByCompletePath(this.brick().name, this.pathVersion(), completePath)
      .subscribe({
        next: (doc) => {
          if (doc) {
            const docUrl = HaRouterService.getDocumentationRoute(
              this.brick().name,
              this.pathVersion(),
              doc.completePath,
              doc.id
            );
            if (docUrl != currentUrl) {
              this.httpRedirectionService.redirectTo(docUrl);
            }
          } else {
            this.docStatusEvent.set({
              status: 'error',
              error: 'doc_not_found',
            });
          }
        },
        error: (error) => {
          this.docStatusEvent.set({ status: 'error', error: error });
        },
      });
  }

  private setTechDoc(techDoc: TdTypeEntity): void {
    if (techDoc == null) {
      this.techDocStatusEvent.set({ status: 'error', error: 'tech_doc_not_found' });
      return;
    }

    this.techDocStatusEvent.set({ status: 'success', object: techDoc });

    if (techDoc.objectType == HaRunStatAggregateObjectType.TASK) {
      this.initRunStatAggregate(HaRunStatAggregateObjectType.TASK, techDoc.typingName);
    } else if (techDoc.objectType == HaRunStatAggregateObjectType.PROTOCOL) {
      this.initRunStatAggregate(HaRunStatAggregateObjectType.PROTOCOL, techDoc.typingName);
    } else {
      this.runStatAggregateStatusEvent.set(null);
    }
  }

  private initBrickRunStatAggregate(brickId: string): void {
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.BRICK_RUN_STAT_KEY)) {
      this.brickRunStatAggregateStatusEvent.set({
        status: 'success',
        object: this.transferState.get(this.BRICK_RUN_STAT_KEY, null) as HaRunStatAggregate,
      });
      this.transferState.remove(this.BRICK_RUN_STAT_KEY);
      return;
    }

    this.runStatAggregateService
      .getObjectRunStatAggregate(brickId, HaRunStatAggregateObjectType.BRICK)
      .subscribe({
        next: (runStatAggregate) => {
          this.brickRunStatAggregateStatusEvent.set({ status: 'success', object: runStatAggregate });
          if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.BRICK_RUN_STAT_KEY)) {
            this.transferState.set(this.BRICK_RUN_STAT_KEY, runStatAggregate);
          }
        },
        error: (error) => {
          this.brickRunStatAggregateStatusEvent.set({ status: 'error', error: error });
        },
      });
  }

  private initRunStatAggregate(objectType: HaRunStatAggregateObjectType, objectId: string): void {
    this.runStatAggregateService.getObjectRunStatAggregate(objectId, objectType).subscribe({
      next: (runStatAggregate) => {
        this.runStatAggregateStatusEvent.set({ status: 'success', object: runStatAggregate });
      },
      error: (error) => {
        this.runStatAggregateStatusEvent.set({ status: 'error', error: error });
      },
    });
  }
}
