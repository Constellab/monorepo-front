import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { HaAgent } from '../../ha-core/ha-model/ha-entities/ha-agent.class';
import {
  HaAgentVersion,
  HaAgentVersionState,
} from '../../ha-core/ha-model/ha-entities/ha-agent-version.class';
import { HaAgentService } from '../../ha-core/ha-service/ha-agent.service';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { ClStringHelper } from '@monorepo/core-lib';
import { HaRouterService } from '../../ha-core/ha-service/ha-router.service';
import { HaHttpRedirectionService } from '../../ha-core/ha-service/ha-http-redirection.service';
import { HaUser } from '../../ha-core/ha-model/ha-entities/ha-user';
import { HaLikeType } from '../../ha-core/ha-model/ha-entities/ha-entity-type.enum';
import { HaLikeService } from '../../ha-core/ha-service/ha-like.service';
import { TeRichText } from '@monorepo/text-editor';
import { HaBrickVersion } from '../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import {
  FlConfirmDialogResult,
  FlDialogService,
  FlSnackBarService,
  FlStatusEvent,
  FlStatusEventSuccess,
} from '@monorepo/front-core-lib';
import { HaJsonLdState } from '../../ha-core/ha-state/ha-json-ld.state';

@Injectable()
export class HaAgentPageState {
  private agentStatusEvent: WritableSignal<FlStatusEvent<HaAgent>> = signal<FlStatusEvent<HaAgent>>(null);
  public isAgentError: Signal<boolean> = computed(() => {
    return this.agentStatusEvent() && this.agentStatusEvent().status == 'error';
  });
  private agent: Signal<HaAgent> = computed(() => {
    if (this.agentStatusEvent() && this.agentStatusEvent().status == 'success')
      return (this.agentStatusEvent() as FlStatusEventSuccess<HaAgent>).object;
    return null;
  });
  public likes: Signal<number> = computed(() => {
    return this.agent().likes;
  });
  private isAgentLoading: Signal<boolean> = computed(() => {
    return this.agentStatusEvent() && this.agentStatusEvent().status == 'loading';
  });
  private agentVersionsList: WritableSignal<HaAgentVersion[]> = signal<HaAgentVersion[]>(null);
  private agentVersionStatusEvent: WritableSignal<FlStatusEvent<HaAgentVersion>> =
    signal<FlStatusEvent<HaAgentVersion>>(null);
  public agentVersion: Signal<HaAgentVersion> = computed(() => {
    if (this.agentVersionStatusEvent() && this.agentVersionStatusEvent().status == 'success')
      return (this.agentVersionStatusEvent() as FlStatusEventSuccess<HaAgentVersion>).object;
    return null;
  });
  public agentVersionIsEditable: Signal<boolean> = computed(() => {
    return this.agentVersion()?.versionState === HaAgentVersionState.DRAFT;
  });
  public isAgentVersionLoading: Signal<boolean> = computed(() => {
    return this.agentVersionStatusEvent() && this.agentVersionStatusEvent().status == 'loading';
  });

  public isAgentVersionError: Signal<boolean> = computed(() => {
    return this.agentVersionStatusEvent() && this.agentVersionStatusEvent().status == 'error';
  });

  private agentCoAuthors: WritableSignal<HaUser[]> = signal<HaUser[]>(null);
  private currentUser: WritableSignal<HaUser> = signal<HaUser>(null);
  public canEditAgent: Signal<boolean> = computed(() => {
    if (this.currentUser() == null) {
      return false;
    }

    if (this.isAgentLoading() || this.agent() == null) {
      return false;
    }

    if (this.currentUser().id === this.agent().createdBy.id) {
      return true;
    }

    if (this.agentCoAuthors() == null) {
      return false;
    }

    return this.agentCoAuthors().some((coAuthor) => coAuthor.id === this.currentUser().id);
  });
  public isAuthor: Signal<boolean> = computed(() => {
    if (this.canEditAgent()) {
      return this.currentUser().id === this.agent().createdBy.id;
    }
    return false;
  });
  private brickDependencies: WritableSignal<HaBrickVersion[]> = signal(null);
  private agentDescription: WritableSignal<TeRichText> = signal(null);
  private isLiked: WritableSignal<boolean> = signal<boolean>(false);

  constructor(
    private agentService: HaAgentService,
    private authenticatedUserService: HaAuthenticatedUserService,
    private httpRedirectionService: HaHttpRedirectionService,
    private likeService: HaLikeService,
    private snackBarService: FlSnackBarService,
    private dialogService: FlDialogService,
    private jsonLdState: HaJsonLdState
  ) {}

  public init(agentId: string, paramTitle: string): void {
    this.initUser(agentId, paramTitle);
  }

  public getAgent(): Signal<HaAgent> {
    return this.agent;
  }

  public setAgent(agent: HaAgent): void {
    if (agent == null || agent.id == null) {
      return;
    }
    this.agentStatusEvent.set({
      status: 'success',
      object: agent,
    });
    // this.jsonLdState.setProductJsonLdContent(agent.title);
    this.setAgentDescription(agent.description);
  }

  public getAgentDescription(): Signal<TeRichText> {
    return this.agentDescription;
  }

  public setAgentDescription(description: TeRichText): void {
    this.agentDescription.set(description);
  }

  public getIsLoading(): Signal<boolean> {
    return this.isAgentLoading;
  }

  public getAgentCoAuthors(): Signal<HaUser[]> {
    return this.agentCoAuthors;
  }

  public getAgentVersionsList(): Signal<HaAgentVersion[]> {
    return this.agentVersionsList;
  }

  public setAgentVersion(agentVersion: HaAgentVersion): void {
    if (agentVersion == null || agentVersion.id == null) {
      return;
    }
    this.agentVersionStatusEvent.set({
      status: 'success',
      object: agentVersion,
    });
    this.checkBrickDependencies(agentVersion);
  }

  public getBrickDependencies(): Signal<HaBrickVersion[]> {
    return this.brickDependencies;
  }

  public setAgentVersionByVersionNumber(agentId: string, versionNumber: string): void {
    this.agentVersionStatusEvent.set({ status: 'waiting' });
    if (!ClStringHelper.isUUID(agentId)) {
      this.agentVersionStatusEvent.set({
        status: 'error',
        error: 'agent_version_not_found',
      });
      return;
    }

    if (this.agentVersion()?.version == +versionNumber) {
      return;
    }

    this.agentService.getAgentVersionByVersionNumber(agentId, versionNumber).subscribe({
      next: (agentVersion) => {
        if (agentVersion == null || agentVersion.id == null) {
          this.agentVersionStatusEvent.set({
            status: 'error',
            error: 'agent_version_not_found',
          });
        } else {
          this.setAgentVersion(agentVersion);
        }
      },
      error: () => {
        this.agentVersionStatusEvent.set({
          status: 'error',
          error: 'agent_version_not_found',
        });
      },
    });
  }

  public setLatestAgentVersion(agentId: string): void {
    this.agentVersionStatusEvent.set({ status: 'loading' });
    this.agentService.getLatestAgentVersionByAgentId(agentId).subscribe({
      next: (agentVersion) => {
        if (agentVersion == null) {
          this.agentVersionStatusEvent.set({
            status: 'error',
            error: 'agent_version_not_found',
          });
        } else {
          this.setAgentVersion(agentVersion);
        }
      },
      error: () => {
        this.agentVersionStatusEvent.set({
          status: 'error',
          error: 'agent_version_not_found',
        });
      },
    });
  }

  public getCurrentUser(): Signal<HaUser> {
    return this.currentUser;
  }

  public addAgentVersionToList(agentVersion: HaAgentVersion): void {
    this.agentVersionsList.update((agentVersions) => {
      return [agentVersion, ...agentVersions];
    });
  }

  public removeAgentVersionToList(agentVersion: HaAgentVersion): void {
    this.agentVersionsList.update((agentVersions) => {
      return agentVersions.filter((lt) => lt.id !== agentVersion.id);
    });
    this.agentVersionStatusEvent.set({
      status: 'waiting',
    });
    this.setLatestAgentVersion(this.agent().id);
  }

  public updateAgentVersion(agentVersion: HaAgentVersion): void {
    this.agentVersionsList.update((agentVersions) => {
      return agentVersions.map((lt) => (lt.id === agentVersion.id ? agentVersion : lt));
    });

    if (this.agentVersion().id === agentVersion.id) {
      this.setAgentVersion(agentVersion);
    }

    if (this.agent().id === agentVersion.agent.id) {
      this.setAgent(agentVersion.agent);
    }
  }

  public getIsLiked(): Signal<boolean> {
    return this.isLiked;
  }

  public setIsLiked(isLiked: boolean): void {
    this.isLiked.set(isLiked);
  }

  public initCoAuthors(): void {
    this.agentService.getCoAuthors(this.agent()?.id).subscribe((coAuthors) => {
      this.agentCoAuthors.set(coAuthors);
    });
  }

  public publishAgentVersion(agentVersionId: string): void {
    if (this.agentVersion()?.versionState === 'PUBLISHED') return;
    if (this.agentVersion().id != agentVersionId) return;
    if (this.agentVersion().code == null || this.agentVersion().code === '') {
      this.snackBarService.openErrorMessage({
        text: 'cannot_publish_agent_version_without_code',
        translateText: true,
      });
      return;
    }
    this.dialogService
      .openConfirmDialog({
        title: 'publish_agent_version',
        content: 'publish_agent_version_confirmation',
        successMessage: 'agent_version_published',
        observable: this.agentService.publishAgentVersion(agentVersionId),
      })
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult<HaAgentVersion>) => {
        if (result?.choice && result.result != null) {
          result.result.agent.latestPublishVersion = result.result.version;
          this.updateAgentVersion(result.result);
          this.agentStatusEvent.set({
            status: 'success',
            object: result.result.agent,
          });
          this.httpRedirectionService.redirectTo(
            HaRouterService.getAgentRoute(result.result.agent.id, result.result.agent.title)
          );
        }
      });
  }

  private initAgent(id: string, paramTitle: string): void {
    this.agentStatusEvent.set({ status: 'loading' });
    if (!ClStringHelper.isUUID(id)) {
      this.agentStatusEvent.set({ status: 'error', error: 'agent_not_found' });
      return;
    }
    this.agentService.getAgentById(id).subscribe({
      next: (agent) => {
        if (agent != null && agent.id != null) {
          this.setAgent(agent);
          this.agentDescription.set(agent.description);
          this.initCoAuthors();
          this.initAgentVersionsList(agent);
          this.initIsLiked(agent);

          if (paramTitle !== ClStringHelper.getCleanUrlPath(agent.title)) {
            this.httpRedirectionService.redirectTo(
              HaRouterService.getAgentRoute(agent.id, ClStringHelper.getCleanUrlPath(agent.title))
            );
          }
        } else {
          this.agentStatusEvent.set({
            status: 'error',
            error: 'agent_not_found',
          });
        }
      },
      error: () => {
        this.agentStatusEvent.set({
          status: 'error',
          error: 'agent_not_found',
        });
      },
    });
  }

  private initAgentVersionsList(agent: HaAgent): void {
    if (agent == null) {
      return;
    }
    this.agentService.getPublishedAgentVersions(agent.id).subscribe((agentVersions) => {
      this.agentVersionsList.set(agentVersions);
    });
  }

  private initUser(agentId: string, paramTitle: string): void {
    this.authenticatedUserService.getUser().subscribe((user) => {
      this.currentUser.set(user);
      this.initAgent(agentId, paramTitle);
    });
  }

  private initIsLiked(agent: HaAgent): void {
    if (agent == null) {
      return;
    }
    this.likeService.checkIfLiked(HaLikeType.AGENT_LIKE, agent.id).subscribe((isLiked) => {
      this.setIsLiked(isLiked);
    });
  }

  private checkBrickDependencies(agentVersion: HaAgentVersion): void {
    this.agentService.getAgentVersionBrickDependencies(agentVersion.id).subscribe((brickDependencies) => {
      this.brickDependencies.set(brickDependencies);
    });
  }
}
