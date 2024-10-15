import {
  computed,
  Inject,
  Injectable,
  makeStateKey,
  PLATFORM_ID,
  Signal,
  signal,
  StateKey,
  TransferState,
  WritableSignal,
} from '@angular/core';
import {
  FlStatusEvent,
  FlStatusEventError,
  FlStatusEventSuccess,
} from '@monorepo/front-core-lib';
import { HaBrick } from '../../ha-core/ha-model/ha-entities/ha-brick.class';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HaBrickService } from '../../ha-core/ha-service/ha-brick.service';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { HaBrickVersion } from '../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import { HaBrickVersionService } from '../../ha-core/ha-service/ha-brick-version.service';
import { HaReferenceDTO } from '../../ha-core/ha-model/ha-entities/ha-version.class';
import { HaDocumentation } from '../../ha-core/ha-model/ha-entities/ha-documentation.class';
import { ClStringHelper } from '@monorepo/core-lib';
import { HaDocumentationService } from '../../ha-core/ha-service/ha-documentation.service';
import { UrlSegment } from '@angular/router';
import { HaRouterService } from '../../ha-core/ha-service/ha-router.service';
import { HaHttpRedirectionService } from '../../ha-core/ha-service/ha-http-redirection.service';
import { HaFile } from '../../ha-core/entity-module/ha-file-core/model/ha-file';
import { TdTypeEntity } from '@monorepo/technical-doc';

@Injectable()
export class HaBrickPageState {
  private BRICK_KEY: StateKey<object> = makeStateKey<HaBrick>('brick');
  private LATEST_BRICK_VERSION_KEY: StateKey<object> = makeStateKey<HaBrick>(
    'latest-brick-version'
  );
  private DOC_KEY: StateKey<object> = makeStateKey<HaDocumentation>('doc');
  private TECH_DOC_KEY: StateKey<object> = makeStateKey<object>('techDoc');

  private pathVersion: WritableSignal<string> = signal<string>(null);
  public brickAndPathVersion: Signal<[HaBrick, string]> = computed(() => {
    return [this.brick(), this.pathVersion()];
  });
  private userHasEditRight: WritableSignal<boolean> = signal<boolean>(null);
  private docFileUrlPrefix: WritableSignal<string> = signal<string>(null);
  private docFiles: WritableSignal<HaFile[]> = signal<HaFile[]>(null);
  private brickStatusEvent: WritableSignal<FlStatusEvent<HaBrick>> =
    signal<FlStatusEvent<HaBrick>>(null);
  public isBrickLoading: Signal<boolean> = computed(() => {
    return (
      this.brickStatusEvent() && this.brickStatusEvent().status === 'loading'
    );
  });
  public isBrickError: Signal<boolean> = computed(() => {
    return (
      this.brickStatusEvent() && this.brickStatusEvent().status === 'error'
    );
  });
  public getBrickError: Signal<string> = computed(() => {
    if (this.isBrickError()) {
      return (this.brickStatusEvent() as FlStatusEventError).error as string;
    }
    return null;
  });
  public brick: Signal<HaBrick> = computed(() => {
    if (
      this.brickStatusEvent() &&
      this.brickStatusEvent().status === 'success'
    ) {
      return (this.brickStatusEvent() as FlStatusEventSuccess<HaBrick>).object;
    }
    return null;
  });
  private latestBrickVersionStatusEvent: WritableSignal<
    FlStatusEvent<HaBrickVersion>
  > = signal<FlStatusEvent<HaBrickVersion>>(null);
  public isLatestBrickVersionLoading: Signal<boolean> = computed(() => {
    return (
      this.latestBrickVersionStatusEvent() &&
      this.latestBrickVersionStatusEvent().status === 'loading'
    );
  });
  public isLatestBrickVersionError: Signal<boolean> = computed(() => {
    return (
      this.latestBrickVersionStatusEvent() &&
      this.latestBrickVersionStatusEvent().status === 'error'
    );
  });
  public getLatestBrickVersionError: Signal<string> = computed(() => {
    if (this.isLatestBrickVersionError()) {
      return (this.latestBrickVersionStatusEvent() as FlStatusEventError)
        .error as string;
    }
    return null;
  });
  public latestBrickVersion: Signal<HaBrickVersion> = computed(() => {
    if (
      this.latestBrickVersionStatusEvent() &&
      this.latestBrickVersionStatusEvent().status === 'success'
    ) {
      return (
        this.latestBrickVersionStatusEvent() as FlStatusEventSuccess<HaBrickVersion>
      ).object;
    }
    return null;
  });
  private docStatusEvent: WritableSignal<FlStatusEvent<HaDocumentation>> =
    signal<FlStatusEvent<HaDocumentation>>(null);
  public isDocLoading: Signal<boolean> = computed(() => {
    return this.docStatusEvent() && this.docStatusEvent().status === 'loading';
  });

  public isDocError: Signal<boolean> = computed(() => {
    return this.docStatusEvent() && this.docStatusEvent().status === 'error';
  });

  public getDocError: Signal<string> = computed(() => {
    if (this.isDocError()) {
      return (this.docStatusEvent() as FlStatusEventError).error as string;
    }
    return null;
  });

  public doc: Signal<HaDocumentation> = computed(() => {
    if (this.docStatusEvent() && this.docStatusEvent().status === 'success') {
      return (this.docStatusEvent() as FlStatusEventSuccess<HaDocumentation>)
        .object;
    }
    return null;
  });
  private directReferences: WritableSignal<HaReferenceDTO[]> =
    signal<HaReferenceDTO[]>(null);

  private techDocStatusEvent: WritableSignal<FlStatusEvent<TdTypeEntity>> =
    signal<FlStatusEvent<TdTypeEntity>>(null);
  public isTechDocLoading: Signal<boolean> = computed(() => {
    return (
      this.techDocStatusEvent() &&
      this.techDocStatusEvent().status === 'loading'
    );
  });
  public isTechDocError: Signal<boolean> = computed(() => {
    return (
      this.techDocStatusEvent() && this.techDocStatusEvent().status === 'error'
    );
  });
  public getTechDocError: Signal<string> = computed(() => {
    if (this.isTechDocError()) {
      return (this.techDocStatusEvent() as FlStatusEventError).error as string;
    }
    return null;
  });
  public techDoc: Signal<TdTypeEntity> = computed(() => {
    if (
      this.techDocStatusEvent() &&
      this.techDocStatusEvent().status === 'success'
    ) {
      return (this.techDocStatusEvent() as FlStatusEventSuccess<TdTypeEntity>)
        .object;
    }
    return null;
  });

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private transferState: TransferState,
    private brickService: HaBrickService,
    private brickVersionService: HaBrickVersionService,
    private authenticatedUserService: HaAuthenticatedUserService,
    private documentationService: HaDocumentationService,
    private httpRedirectionService: HaHttpRedirectionService
  ) {}

  public init(brickName: string, version: string): void {
    this.pathVersion.set(version);
    this.initBrick(brickName, version);
  }

  public setBrick(brick: HaBrick): void {
    if (brick == null || brick.id == null) {
      this.brickStatusEvent.set({ status: 'error', error: 'brick_not_found' });
      return;
    }

    this.brickStatusEvent.set({ status: 'success', object: brick });
  }

  public getDirectReferences(): Signal<HaReferenceDTO[]> {
    return this.directReferences;
  }

  public getBrickVersionPath(): Signal<string> {
    return this.pathVersion;
  }

  public getUserHasEditRight(): Signal<boolean> {
    return this.userHasEditRight;
  }

  public getDocFileUrlPrefix(): Signal<string> {
    return this.docFileUrlPrefix;
  }

  public getDocFiles(): Signal<HaFile[]> {
    return this.docFiles;
  }

  public setLatestBrickVersion(brickVersion: HaBrickVersion): void {
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

  public initDoc(docId: string, url: UrlSegment[]): void {

    if (!this.brick() || !this.latestBrickVersion()) {
      return;
    }

    if (this.doc() && this.doc().id === docId) {
      return;
    }

    this.docStatusEvent.set({ status: 'loading' });


    if (!ClStringHelper.isUUID(docId)) {
      this.redirectToCompletePathDoc(url);
    }

    if (
      isPlatformBrowser(this.platformId) &&
      this.transferState.hasKey(this.DOC_KEY)
    ) {
      this.setDoc(
        this.transferState.get(this.DOC_KEY, null) as HaDocumentation
      );
      this.transferState.remove(this.DOC_KEY);
      return;
    }

    this.documentationService.getById(docId).subscribe({
      next: (doc) => {
        this.setDoc(doc);
        if (
          isPlatformServer(this.platformId) &&
          !this.transferState.hasKey(this.DOC_KEY)
        ) {
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
    this.initDocFileUrlPrefix(doc.id);
    this.initDocFiles(doc.id);
  }

  private initUserHasEditRight(brick: HaBrick): void {
    this.authenticatedUserService.isBrickCreatorOrBrickUser(brick).subscribe({
      next: (hasEditRight) => {
        this.userHasEditRight.set(hasEditRight);
      },
    });
  }

  private initBrick(name: string, version: string): void {
    this.brickStatusEvent.set({ status: 'loading' });

    if (
      isPlatformBrowser(this.platformId) &&
      this.transferState.hasKey(this.BRICK_KEY)
    ) {
      this.onInitBrick(this.transferState.get(this.BRICK_KEY, null) as HaBrick);
      this.transferState.remove(this.BRICK_KEY);
      return;
    }

    this.brickService.getByName(name).subscribe({
      next: (brick) => {
        this.onInitBrick(brick);
        if (
          isPlatformServer(this.platformId) &&
          !this.transferState.hasKey(this.BRICK_KEY)
        ) {
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
    if (
      isPlatformBrowser(this.platformId) &&
      this.transferState.hasKey(this.LATEST_BRICK_VERSION_KEY)
    ) {
      const latestBrickVersion = this.transferState.get(
        this.LATEST_BRICK_VERSION_KEY,
        null
      ) as HaBrickVersion;
      this.transferState.remove(this.LATEST_BRICK_VERSION_KEY);
      if (latestBrickVersion && latestBrickVersion.id) {
        this.setLatestBrickVersion(
          HaBrickVersion.initInstance(latestBrickVersion)
        );
      }
      return;
    }

    this.brickService.getLastVersion(brick?.name).subscribe({
      next: (brickVersion: HaBrickVersion) => {
        this.setLatestBrickVersion(brickVersion);
        if (
          isPlatformServer(this.platformId) &&
          !this.transferState.hasKey(this.LATEST_BRICK_VERSION_KEY)
        ) {
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
    this.brickVersionService
      .getDirectReferences(brickVersionId)
      .subscribe((res) => {
        this.directReferences.set(res);
      });
  }

  private initDocFileUrlPrefix(docId: string): void {
    this.docFileUrlPrefix.set(
      this.documentationService.getDocFilePrefix(docId)
    );
  }

  private initDocFiles(docId: string): void {
    this.documentationService.getDocFiles(docId).subscribe({
      next: (docFiles) => {
        this.docFiles.set(docFiles);
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
    return;
  }

  public initTechDoc(techDocType: string, techDocUniqueName: string): void{
    if (!this.brick() || !this.latestBrickVersion()) {
      return;
    }

    this.techDocStatusEvent.set({ status: 'loading' });

    if (
      isPlatformBrowser(this.platformId) &&
      this.transferState.hasKey(this.TECH_DOC_KEY)
    ) {
      this.setTechDoc(this.transferState.get(this.TECH_DOC_KEY, null) as TdTypeEntity)
      this.transferState.remove(this.TECH_DOC_KEY);
      return;
    }

    this.brickService.getTechDocByPath(
      this.brick().name,
      this.pathVersion(),
      techDocType,
      techDocUniqueName
    ).subscribe({
      next: (techDoc) => {
        if (!techDoc){
          this.techDocStatusEvent.set({ status: 'error', error: 'tech_doc_not_found' });
          return;
        }
        this.setTechDoc(techDoc);
        if (
          isPlatformServer(this.platformId) &&
          !this.transferState.hasKey(this.TECH_DOC_KEY)
        ) {
          this.transferState.set(this.TECH_DOC_KEY, techDoc);
        }
      },
      error: (error) => {
        this.techDocStatusEvent.set({ status: 'error', error: error });
      },
    });
  }

  private setTechDoc(techDoc: TdTypeEntity): void {
    if (techDoc == null) {
      this.techDocStatusEvent.set({ status: 'error', error: 'tech_doc_not_found' });
      return;
    }

    this.techDocStatusEvent.set({ status: 'success', object: techDoc });
  }
}
