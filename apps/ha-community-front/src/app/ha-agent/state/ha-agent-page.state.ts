import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlStatusEvent } from '@monorepo/front-core-lib/fl-core';
import { FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TeRichText } from '@monorepo/text-editor';
import { filter, first } from 'rxjs';

import { HaAgent } from '../../ha-core/ha-model/ha-entities/ha-agent.class';
import {
  HaAgentVersion,
  HaAgentVersionState,
} from '../../ha-core/ha-model/ha-entities/ha-agent-version.class';
import { HaBrickVersion } from '../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import {
  HaRunStatAggregate,
  HaRunStatAggregateObjectType,
} from '../../ha-core/ha-model/ha-entities/ha-run-stat-aggregate.class';
import { HaUser } from '../../ha-core/ha-model/ha-entities/ha-user';
import { HaAgentService } from '../../ha-core/ha-service/ha-agent.service';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { HaHttpRedirectionService } from '../../ha-core/ha-service/ha-http-redirection.service';
import { HaRouterService } from '../../ha-core/ha-service/ha-router.service';
import { HaRunStatAggregateService } from '../../ha-core/ha-service/ha-run-stat-aggregate.service';

@Injectable()
export class HaAgentPageState {
  private agentService = inject(HaAgentService);
  private authenticatedUserService = inject(HaAuthenticatedUserService);
  private httpRedirectionService = inject(HaHttpRedirectionService);
  private snackBarService = inject(FlSnackBarService);
  private dialogService = inject(FlDialogService);

  private runStatAggregateService: HaRunStatAggregateService = inject(HaRunStatAggregateService);

  private agentStatusEvent: WritableSignal<FlStatusEvent<HaAgent> | null> =
    signal<FlStatusEvent<HaAgent> | null>(null);
  public isAgentError: Signal<boolean> = computed(() => {
    return this.agentStatusEvent()?.status == 'error';
  });
  private agent: Signal<HaAgent | null> = computed(() => {
    const agentStatusEvent = this.agentStatusEvent();
    if (agentStatusEvent && agentStatusEvent.status == 'success') return agentStatusEvent.object;
    return null;
  });
  private isAgentLoading: Signal<boolean> = computed(() => {
    return this.agentStatusEvent()?.status == 'loading';
  });
  private agentVersionsList: WritableSignal<HaAgentVersion[] | null> = signal<HaAgentVersion[] | null>(null);
  private agentVersionStatusEvent: WritableSignal<FlStatusEvent<HaAgentVersion> | null> =
    signal<FlStatusEvent<HaAgentVersion> | null>(null);
  public agentVersion: Signal<HaAgentVersion | null> = computed(() => {
    const agentVersionStatusEvent = this.agentVersionStatusEvent();
    if (agentVersionStatusEvent && agentVersionStatusEvent.status == 'success')
      return agentVersionStatusEvent.object;
    return null;
  });
  public agentVersionIsEditable: Signal<boolean> = computed(() => {
    return this.agentVersion()?.versionState === HaAgentVersionState.DRAFT;
  });
  public isAgentVersionLoading: Signal<boolean> = computed(() => {
    return this.agentVersionStatusEvent()?.status == 'loading';
  });

  public isAgentVersionError: Signal<boolean> = computed(() => {
    return this.agentVersionStatusEvent()?.status == 'error';
  });

  private agentCoAuthors: WritableSignal<HaUser[] | null> = signal<HaUser[] | null>(null);
  private currentUser: WritableSignal<HaUser | null> = signal<HaUser | null>(null);
  public canEditAgent: Signal<boolean> = computed(() => {
    const currentUser = this.currentUser();
    if (currentUser == null) {
      return false;
    }

    const agent = this.agent();
    if (this.isAgentLoading() || agent == null) {
      return false;
    }

    if (currentUser.id === agent.createdBy.id) {
      return true;
    }

    const agentCoAuthors = this.agentCoAuthors();
    if (agentCoAuthors == null) {
      return false;
    }

    return agentCoAuthors.some((coAuthor) => coAuthor.id === currentUser.id);
  });
  public isAuthor: Signal<boolean> = computed(() => {
    if (this.canEditAgent()) {
      const currentUser = this.currentUser();
      const agent = this.agent();
      return currentUser != null && agent != null && currentUser.id === agent.createdBy.id;
    }
    return false;
  });
  private brickDependencies: WritableSignal<HaBrickVersion[] | null> = signal<HaBrickVersion[] | null>(null);
  private agentDescription: WritableSignal<TeRichText | undefined> = signal<TeRichText | undefined>(
    undefined
  );

  private agentRunStatAggregateStatusEvent: WritableSignal<FlStatusEvent<HaRunStatAggregate> | null> =
    signal<FlStatusEvent<HaRunStatAggregate> | null>(null);
  private runStatAggregateStatusEvent: WritableSignal<FlStatusEvent<HaRunStatAggregate> | null> =
    signal<FlStatusEvent<HaRunStatAggregate> | null>(null);

  public agentRunStatAggregate: Signal<HaRunStatAggregate | null> = computed(() => {
    const agentRunStatAggregateStatusEvent = this.agentRunStatAggregateStatusEvent();
    if (agentRunStatAggregateStatusEvent && agentRunStatAggregateStatusEvent.status == 'success')
      return agentRunStatAggregateStatusEvent.object;
    return null;
  });

  public runStatAggregate: Signal<HaRunStatAggregate | null> = computed(() => {
    const runStatAggregateStatusEvent = this.runStatAggregateStatusEvent();
    if (runStatAggregateStatusEvent && runStatAggregateStatusEvent.status == 'success')
      return runStatAggregateStatusEvent.object;
    return null;
  });

  public init(agentId: string, paramTitle: string): void {
    this.initUser(agentId, paramTitle);
  }

  public getAgent(): Signal<HaAgent | null> {
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

  public getAgentDescription(): Signal<TeRichText | undefined> {
    return this.agentDescription;
  }

  public setAgentDescription(description: TeRichText | undefined): void {
    this.agentDescription.set(description);
  }

  public getIsLoading(): Signal<boolean> {
    return this.isAgentLoading;
  }

  public getAgentCoAuthors(): Signal<HaUser[] | null> {
    return this.agentCoAuthors;
  }

  public getAgentVersionsList(): Signal<HaAgentVersion[] | null> {
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
    this.initAgentVersionRunStatAggregate(agentVersion.id);
  }

  public getBrickDependencies(): Signal<HaBrickVersion[] | null> {
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

  public getCurrentUser(): Signal<HaUser | null> {
    return this.currentUser;
  }

  public addAgentVersionToList(agentVersion: HaAgentVersion): void {
    this.agentVersionsList.update((agentVersions) => {
      return [agentVersion, ...(agentVersions ?? [])];
    });
  }

  public removeAgentVersionToList(agentVersion: HaAgentVersion): void {
    this.agentVersionsList.update((agentVersions) => {
      return (agentVersions ?? []).filter((lt) => lt.id !== agentVersion.id);
    });
    this.agentVersionStatusEvent.set({
      status: 'waiting',
    });
    const agent = this.agent();
    if (agent != null) {
      this.setLatestAgentVersion(agent.id);
    }
  }

  public updateAgentVersion(agentVersion: HaAgentVersion): void {
    this.agentVersionsList.update((agentVersions) => {
      return (agentVersions ?? []).map((lt) => (lt.id === agentVersion.id ? agentVersion : lt));
    });

    if (this.agentVersion()?.id === agentVersion.id) {
      this.setAgentVersion(agentVersion);
    }

    if (this.agent()?.id === agentVersion.agent.id) {
      this.setAgent(agentVersion.agent);
    }
  }

  public initCoAuthors(): void {
    const agent = this.agent();
    if (agent == null) return;

    this.agentService.getCoAuthors(agent.id).subscribe({
      next: (coAuthors) => this.agentCoAuthors.set(coAuthors),
      error: () => {
        this.agentCoAuthors.set([]);
        this.snackBarService.openErrorMessage({ text: 'error_loading_co_authors', translateText: true });
      },
    });
  }

  public publishAgentVersion(agentVersionId: string): void {
    const agentVersion = this.agentVersion();
    if (agentVersion == null) return;
    if (agentVersion.versionState === 'PUBLISHED') return;
    if (agentVersion.id != agentVersionId) return;
    if (agentVersion.code == null || agentVersion.code === '') {
      this.snackBarService.openErrorMessage({
        text: 'cannot_publish_agent_version_without_code',
        translateText: true,
      });
      return;
    }
    this.dialogService
      .openConfirmDialog({
        title: 'confirm_publish_agent_version',
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
          this.initAgentRunStatAggregate(agent.id);

          if (paramTitle !== ClStringHelper.getCleanUrlPath(agent.title)) {
            this.httpRedirectionService.redirectTo(
              HaRouterService.getAgentRoute(agent.id, ClStringHelper.getCleanUrlPath(agent.title) ?? '')
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
    this.agentService.getPublishedAgentVersions(agent.id).subscribe({
      next: (agentVersions) => this.agentVersionsList.set(agentVersions),
      error: () => {
        this.agentVersionsList.set([]);
        this.snackBarService.openErrorMessage({ text: 'error_loading_agent_versions', translateText: true });
      },
    });
  }

  private initUser(agentId: string, paramTitle: string): void {
    this.authenticatedUserService
      .getUser()
      .pipe(
        filter((user) => user !== undefined),
        first()
      )
      .subscribe((user) => {
        this.currentUser.set(user);
        this.initAgent(agentId, paramTitle);
      });
  }

  private checkBrickDependencies(agentVersion: HaAgentVersion): void {
    this.agentService.getAgentVersionBrickDependencies(agentVersion.id).subscribe({
      next: (brickDependencies) => this.brickDependencies.set(brickDependencies),
      error: () => {
        this.brickDependencies.set([]);
        this.snackBarService.openErrorMessage({
          text: 'error_loading_brick_dependencies',
          translateText: true,
        });
      },
    });
  }

  private initAgentRunStatAggregate(agentId: string): void {
    this.agentRunStatAggregateStatusEvent.set({ status: 'loading' });
    this.runStatAggregateService
      .getObjectRunStatAggregate(agentId, HaRunStatAggregateObjectType.AGENT)
      .subscribe({
        next: (runStatAggregate) => {
          this.agentRunStatAggregateStatusEvent.set({
            status: 'success',
            object: runStatAggregate,
          });
        },
        error: () => {
          this.agentRunStatAggregateStatusEvent.set({
            status: 'error',
            error: 'run_stat_group_not_found',
          });
        },
      });
  }

  private initAgentVersionRunStatAggregate(agentVersionId: string): void {
    this.runStatAggregateStatusEvent.set({ status: 'loading' });
    this.runStatAggregateService
      .getObjectRunStatAggregate(agentVersionId, HaRunStatAggregateObjectType.AGENT_VERSION)
      .subscribe({
        next: (runStatAggregate) => {
          this.runStatAggregateStatusEvent.set({
            status: 'success',
            object: runStatAggregate,
          });
        },
        error: () => {
          this.runStatAggregateStatusEvent.set({
            status: 'error',
            error: 'run_stat_group_not_found',
          });
        },
      });
  }
}
