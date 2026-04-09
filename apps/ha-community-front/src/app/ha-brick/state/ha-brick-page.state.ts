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
import { TdTypeEntity } from '@monorepo/technical-doc';
import { TeBlockHeaderData, TeBlockHeaderLevel } from '@monorepo/text-editor';
import { plainToInstance } from 'class-transformer';
import { filter, first, Observable, of, tap } from 'rxjs';

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

/**
 * State management for the brick detail page.
 *
 * This is the most complex state in the app — it illustrates the key patterns used across all page states:
 *
 * 1. **Signal-based state**: Private WritableSignals + public readonly signals.
 *    Components bind to the readonly signals; only the state class can mutate them.
 *
 * 2. **SSR TransferState pattern**: Data fetched during server-side rendering is stored in
 *    TransferState keys. On the client, getFromTransferStateOrFetch() checks for cached data
 *    before making an API call, avoiding duplicate requests after hydration.
 *
 * 3. **Loading/error pattern**: Each async resource (brick, doc, techDoc) has its own
 *    _loading and _error signals so the template can show appropriate UI states.
 *
 * 4. **Provided per-component**: Declared with @Injectable() (no providedIn) and listed in the
 *    component's providers array, so each page instance gets its own state.
 *
 * Other page states (ha-agent-page.state, ha-story.state, etc.) follow the same patterns
 * but are simpler since they don't have the doc/techDoc/version complexity.
 */
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

  private _brick = signal<HaBrick>(null);
  private _brickLoading = signal(false);
  private _brickError = signal(false);

  private _latestBrickVersion = signal<HaBrickVersion>(null);

  private _doc = signal<HaDocumentation>(null);
  private _docLoading = signal(false);
  private _docError = signal(false);

  private _techDoc = signal<TdTypeEntity>(null);
  private _techDocLoading = signal(false);
  private _techDocError = signal(false);

  private _brickRunStatAggregate = signal<HaRunStatAggregate>(null);
  private _runStatAggregate = signal<HaRunStatAggregate>(null);

  // --- Public readonly signals ---
  readonly pathVersion: Signal<string> = this._pathVersion.asReadonly();
  readonly userHasEditRight: Signal<boolean> = this._userHasEditRight.asReadonly();
  readonly docFileUrlPrefix: Signal<string> = this._docFileUrlPrefix.asReadonly();
  readonly docFiles: Signal<HaFile[]> = this._docFiles.asReadonly();
  readonly tempTitle: Signal<string> = this._tempTitle.asReadonly();
  readonly coAuthors: Signal<HaUser[]> = this._coAuthors.asReadonly();
  readonly directReferences: Signal<HaReferenceDTO[]> = this._directReferences.asReadonly();

  readonly brick: Signal<HaBrick> = this._brick.asReadonly();
  readonly isBrickLoading: Signal<boolean> = this._brickLoading.asReadonly();
  readonly isBrickError: Signal<boolean> = this._brickError.asReadonly();

  readonly latestBrickVersion: Signal<HaBrickVersion> = this._latestBrickVersion.asReadonly();

  readonly doc: Signal<HaDocumentation> = this._doc.asReadonly();
  readonly isDocLoading: Signal<boolean> = this._docLoading.asReadonly();
  readonly isDocError: Signal<boolean> = this._docError.asReadonly();

  readonly techDoc: Signal<TdTypeEntity> = this._techDoc.asReadonly();
  readonly isTechDocLoading: Signal<boolean> = this._techDocLoading.asReadonly();
  readonly isTechDocError: Signal<boolean> = this._techDocError.asReadonly();

  readonly brickRunStatAggregate: Signal<HaRunStatAggregate> = this._brickRunStatAggregate.asReadonly();
  readonly runStatAggregate: Signal<HaRunStatAggregate> = this._runStatAggregate.asReadonly();

  readonly docHeaders: Signal<TeBlockHeaderData[]> = computed(() => {
    if (!this.doc()?.content) return [];
    return this.doc().content?.getHeadersData([TeBlockHeaderLevel.HEADER_1, TeBlockHeaderLevel.HEADER_2]);
  });

  // --- Public methods ---

  public init(brickName: string, version: string): void {
    if (!this.isValidVersion(version)) {
      this._brickError.set(true);
      this._brickLoading.set(false);
      return;
    }
    this._pathVersion.set(version);
    this._tempTitle.set(ClStringHelper.fromKebabCaseToSentence(brickName));
    this.initBrick(brickName);
  }

  public setBrick(brick: HaBrick): void {
    if (brick == null || brick.id == null) {
      this._brickError.set(true);
      this._brickLoading.set(false);
      this._brick.set(null);
      return;
    }
    this._brick.set(brick);
    this._brickLoading.set(false);
    this._brickError.set(false);

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

      this._docLoading.set(true);
      this._docError.set(false);
      if (url.length == 1 && url[0].path == 'getting-started') {
        this.redirectToGettingStartedDoc(brick);
        return;
      }

      this.redirectToCompletePathDoc(url);
      return;
    }

    // UUID docId — can load immediately without brick
    this._docLoading.set(true);
    this._docError.set(false);
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
      error: () => {
        this._docError.set(true);
        this._docLoading.set(false);
        this._doc.set(null);
      },
    });
  }

  public setDoc(doc: HaDocumentation): void {
    if (doc == null || doc.id == null) {
      this._docError.set(true);
      this._docLoading.set(false);
      this._doc.set(null);
      return;
    }

    this._doc.set(doc);
    this._docLoading.set(false);
    this._docError.set(false);
  }

  public initTechDoc(
    brickName: string,
    version: string,
    techDocType: string,
    techDocUniqueName: string
  ): void {
    if (!this.isValidVersion(version)) {
      this._techDocError.set(true);
      this._techDocLoading.set(false);
      return;
    }

    this._techDocLoading.set(true);
    this._techDocError.set(false);

    this.getFromTransferStateOrFetch(this.TECH_DOC_KEY, () =>
      this.brickService.getTechDocByPath(brickName, version, techDocType, techDocUniqueName)
    ).subscribe({
      next: (techDoc) => {
        if (!techDoc) {
          this._techDocError.set(true);
          this._techDocLoading.set(false);
          this._techDoc.set(null);
          return;
        }
        this.setTechDoc(techDoc as TdTypeEntity);
      },
      error: () => {
        this._techDocError.set(true);
        this._techDocLoading.set(false);
        this._techDoc.set(null);
      },
    });
  }

  // --- Private methods ---

  private isValidVersion(version: string): boolean {
    if (!version) return false;
    return version === 'latest' || /^v\d+\.\d+\.\d+(-beta\.\d+)?$/.test(version);
  }

  /**
   * SSR hydration helper: on the browser, returns cached TransferState data if available;
   * otherwise calls the API and caches the result on the server for the next hydration cycle.
   */
  private getFromTransferStateOrFetch<T>(key: StateKey<T>, fetcher: () => Observable<T>): Observable<T> {
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(key as StateKey<any>)) {
      const data = this.transferState.get(key as StateKey<any>, null) as T;
      this.transferState.remove(key as StateKey<any>);
      return of(data);
    }

    return fetcher().pipe(
      tap((data) => {
        if (isPlatformServer(this.platformId) && !this.transferState.hasKey(key as StateKey<any>)) {
          this.transferState.set(key as StateKey<any>, data as any);
        }
      })
    );
  }

  private initCoAuthors(brickId: string): void {
    this.getFromTransferStateOrFetch(this.CO_AUTHORS_KEY, () =>
      this.brickService.getCoAuthors(brickId)
    ).subscribe((coAuthors) => {
      this._coAuthors.set(coAuthors as HaUser[]);
    });
  }

  private setLatestBrickVersion(brickVersion: HaBrickVersion): void {
    if (brickVersion == null || brickVersion.id == null) {
      this._latestBrickVersion.set(null);
      return;
    }

    this._latestBrickVersion.set(brickVersion);
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
    this.authenticatedUserService
      .getUser()
      .pipe(
        filter((user) => user !== undefined),
        first()
      )
      .subscribe((user: HaUser) => {
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
    this._brickLoading.set(true);
    this._brickError.set(false);

    this.getFromTransferStateOrFetch(this.BRICK_KEY, () => this.brickService.getByName(name)).subscribe({
      next: (brick) => {
        this.onInitBrick(brick as HaBrick);
      },
      error: () => {
        this._brickError.set(true);
        this._brickLoading.set(false);
        this._brick.set(null);
      },
    });
  }

  private onInitBrick(brick: HaBrick): void {
    this.setBrick(brick);
    this.initLatestBrickVersion(brick);
    this.initUserHasEditRight(brick);
  }

  private initLatestBrickVersion(brick: HaBrick): void {
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
      error: () => {
        this._latestBrickVersion.set(null);
      },
    });
  }

  private initBrickVersionDirectReferences(brickVersionId: string): void {
    this.getFromTransferStateOrFetch(this.DIRECT_REFERENCES_KEY, () =>
      this.brickVersionService.getDirectReferences(brickVersionId)
    ).subscribe((res) => {
      this._directReferences.set(res as HaReferenceDTO[]);
    });
  }

  private initDocFileUrlPrefix(docId: string): void {
    this._docFileUrlPrefix.set(this.documentationService.getDocFilePrefix(docId));
  }

  private initDocFiles(docId: string): void {
    this.getFromTransferStateOrFetch(this.DOC_FILES_KEY, () =>
      this.documentationService.getDocFiles(docId)
    ).subscribe({
      next: (docFiles) => {
        this._docFiles.set(docFiles as HaFile[]);
      },
      error: () => {
        this._docError.set(true);
        this._docLoading.set(false);
        this._doc.set(null);
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
            this._docError.set(true);
            this._docLoading.set(false);
            this._doc.set(null);
          }
        },
        error: () => {
          this._docError.set(true);
          this._docLoading.set(false);
          this._doc.set(null);
        },
      });
  }

  private setTechDoc(techDoc: TdTypeEntity): void {
    if (techDoc == null) {
      this._techDocError.set(true);
      this._techDocLoading.set(false);
      this._techDoc.set(null);
      return;
    }

    this._techDoc.set(techDoc);
    this._techDocLoading.set(false);
    this._techDocError.set(false);

    if (techDoc.objectType == HaRunStatAggregateObjectType.TASK) {
      this.initRunStatAggregate(HaRunStatAggregateObjectType.TASK, techDoc.typingName);
    } else if (techDoc.objectType == HaRunStatAggregateObjectType.PROTOCOL) {
      this.initRunStatAggregate(HaRunStatAggregateObjectType.PROTOCOL, techDoc.typingName);
    } else {
      this._runStatAggregate.set(null);
    }
  }

  private initBrickRunStatAggregate(brickId: string): void {
    this.getFromTransferStateOrFetch(this.BRICK_RUN_STAT_KEY, () =>
      this.runStatAggregateService.getObjectRunStatAggregate(brickId, HaRunStatAggregateObjectType.BRICK)
    ).subscribe({
      next: (runStatAggregate) => {
        this._brickRunStatAggregate.set(runStatAggregate as HaRunStatAggregate);
      },
      error: () => {
        this._brickRunStatAggregate.set(null);
      },
    });
  }

  private initRunStatAggregate(objectType: HaRunStatAggregateObjectType, objectId: string): void {
    this.runStatAggregateService.getObjectRunStatAggregate(objectId, objectType).subscribe({
      next: (runStatAggregate) => {
        this._runStatAggregate.set(runStatAggregate);
      },
      error: () => {
        this._runStatAggregate.set(null);
      },
    });
  }
}
