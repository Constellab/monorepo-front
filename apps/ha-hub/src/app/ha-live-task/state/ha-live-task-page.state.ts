import {computed, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {HaLiveTask} from '../../ha-core/ha-model/ha-entities/ha-live-task.class';
import {HaLiveTaskVersion, HaLiveTaskVersionState} from '../../ha-core/ha-model/ha-entities/ha-live-task-version.class';
import {HaLiveTaskService} from '../../ha-core/ha-service/ha-live-task.service';
import {HaAuthenticatedUserService} from '../../ha-core/ha-service/ha-authenticated-user.service';
import {ClStringHelper} from '@monorepo/core-lib';
import {HaRouterService} from '../../ha-core/ha-service/ha-router.service';
import {HaHttpRedirectionService} from '../../ha-core/ha-service/ha-http-redirection.service';
import {HaUser} from '../../ha-core/ha-model/ha-entities/ha-user';
import {HaLikeType} from '../../ha-core/ha-model/ha-entities/ha-entity-type.enum';
import {HaLikeService} from '../../ha-core/ha-service/ha-like.service';
import {TeRichTextContent} from '@monorepo/text-editor';
import {HaBrickVersion} from '../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import {FlStatusEvent, FlStatusEventSuccess} from '@monorepo/front-core-lib';

@Injectable()
export class HaLiveTaskPageState {
  public liveTaskVersionIsEditable: Signal<boolean> = computed(() => {
    return this.liveTaskVersion()?.versionState === HaLiveTaskVersionState.DRAFT;
  });
  private liveTaskStatusEvent: WritableSignal<FlStatusEvent<HaLiveTask>> = signal<FlStatusEvent<HaLiveTask>>(null);
  private liveTask: Signal<HaLiveTask> = computed(() => {
    if (this.liveTaskStatusEvent() && this.liveTaskStatusEvent().status == 'success')
      return (this.liveTaskStatusEvent() as FlStatusEventSuccess<HaLiveTask>).object;
    return null;
  });
  public likes: Signal<number> = computed(() => {
    return this.liveTask().likes;
  });
  private isLiveTaskLoading: Signal<boolean> = computed(() => {
    return this.liveTaskStatusEvent() && this.liveTaskStatusEvent().status == 'loading';
  });
  public isLiveTaskError: Signal<boolean> = computed(() => {
    return this.liveTaskVersionStatusEvent() && this.liveTaskVersionStatusEvent().status == 'error';
  });
  private liveTaskVersionsList: WritableSignal<HaLiveTaskVersion[]> = signal<HaLiveTaskVersion[]>(null);
  private liveTaskVersionStatusEvent: WritableSignal<FlStatusEvent<HaLiveTaskVersion>> = signal<FlStatusEvent<HaLiveTaskVersion>>(null);

  public liveTaskVersion: Signal<HaLiveTaskVersion> = computed(() => {
    if (this.liveTaskVersionStatusEvent() && this.liveTaskVersionStatusEvent().status == 'success')
      return (this.liveTaskVersionStatusEvent() as FlStatusEventSuccess<HaLiveTaskVersion>).object;
    return null;
  });

  public isLiveTaskVersionLoading: Signal<boolean> = computed(() => {
    return this.liveTaskVersionStatusEvent() && this.liveTaskVersionStatusEvent().status == 'loading';
  });

  public isLiveTaskVersionError: Signal<boolean> = computed(() => {
    return this.liveTaskVersionStatusEvent() && this.liveTaskVersionStatusEvent().status == 'error';
  });

  private liveTaskCoAuthors: WritableSignal<HaUser[]> = signal<HaUser[]>(null);
  private currentUser: WritableSignal<HaUser> = signal<HaUser>(null);
  public canEditLt: Signal<boolean> = computed(() => {
    if (this.currentUser() == null) {
      return false;
    }

    if (this.isLiveTaskLoading() || this.liveTask() == null) {
      return false;
    }

    if (this.currentUser().id === this.liveTask().createdBy.id) {
      return true;
    }

    if (this.liveTaskCoAuthors() == null) {
      return false;
    }

    return this.liveTaskCoAuthors().some(coAuthor => coAuthor.id === this.currentUser().id);
  });
  public isAuthor: Signal<boolean> = computed(() => {
    if (this.canEditLt()) {
      return this.currentUser().id === this.liveTask().createdBy.id;
    }
    return false;
  })
  private brickDependencies: WritableSignal<HaBrickVersion[]> = signal<HaBrickVersion[]>(null);
  private liveTaskDescription: WritableSignal<TeRichTextContent> = signal<TeRichTextContent>(null);
  private isLiked: WritableSignal<boolean> = signal<boolean>(false);

  constructor(private liveTaskService: HaLiveTaskService,
              private authenticatedUserService: HaAuthenticatedUserService,
              private httpRedirectionService: HaHttpRedirectionService,
              private likeService: HaLikeService) {
  }

  public init(liveTaskId: string, paramTitle: string): void {
    this.initLiveTask(liveTaskId, paramTitle);
    this.liveTaskService.getPublishedLiveTaskVersions(liveTaskId).subscribe(liveTaskVersions => {
      this.liveTaskVersionsList.set(liveTaskVersions);
    });
    this.initUser();
  }

  public getLiveTask(): Signal<HaLiveTask> {
    return this.liveTask;
  }

  public setLiveTask(liveTask: HaLiveTask): void {
    if (liveTask == null || liveTask.id == null) {
      return;
    }
    this.liveTaskStatusEvent.set({
      status: 'success',
      object: liveTask
    });
    this.setLiveTaskDescription(liveTask.description);
  }

  public getLiveTaskDescription(): Signal<TeRichTextContent> {
    return this.liveTaskDescription;
  }

  public setLiveTaskDescription(description: TeRichTextContent): void {
    this.liveTaskDescription.set(description);
  }

  public getIsLoading(): Signal<boolean> {
    return this.isLiveTaskLoading;
  }

  public getLiveTaskCoAuthors(): Signal<HaUser[]> {
    return this.liveTaskCoAuthors;
  }

  public getLiveTaskVersionsList(): Signal<HaLiveTaskVersion[]> {
    return this.liveTaskVersionsList;
  }

  public setLiveTaskVersion(liveTaskVersion: HaLiveTaskVersion): void {
    if (liveTaskVersion == null || liveTaskVersion.id == null) {
      return;
    }
    this.liveTaskVersionStatusEvent.set({
      status: 'success',
      object: liveTaskVersion
    });
    this.checkBrickDependencies(liveTaskVersion);
  }

  public getBrickDependencies(): Signal<HaBrickVersion[]> {
    return this.brickDependencies;
  }

  public setLiveTaskVersionByVersionNumber(liveTaskId: string, versionNumber: string): void {
    this.liveTaskService.getLiveTaskVersionByVersionNumber(liveTaskId, versionNumber).subscribe({
      next: (liveTaskVersion) => {
        if (liveTaskVersion == null) {
          this.liveTaskVersionStatusEvent.set({status: 'error', error: 'live_task_version_not_found'});
        } else {
          this.setLiveTaskVersion(liveTaskVersion);
        }
      },
      error: () => {
        this.liveTaskVersionStatusEvent.set({status: 'error', error: 'live_task_version_not_found'});
      }
    });
  }

  public setLatestLiveTaskVersion(liveTaskId: string): void {
    this.liveTaskVersionStatusEvent.set({status: 'loading'});
    this.liveTaskService.getLatestLiveTaskVersionByLiveTaskId(liveTaskId).subscribe({
      next: (liveTaskVersion) => {
        if (liveTaskVersion == null) {
          this.liveTaskVersionStatusEvent.set({status: 'error', error: 'live_task_version_not_found'});
        } else {
          this.setLiveTaskVersion(liveTaskVersion);
        }
      },
      error: () => {
        this.liveTaskVersionStatusEvent.set({status: 'error', error: 'live_task_version_not_found'});
      }
    });
  }

  public getCurrentUser(): Signal<HaUser> {
    return this.currentUser;
  }

  public addLiveTaskVersionToList(liveTaskVersion: HaLiveTaskVersion): void {
    this.liveTaskVersionsList.update(liveTaskVersions => {
      return [liveTaskVersion, ...liveTaskVersions];
    });
  }

  public removeLiveTaskVersionToList(liveTaskVersion: HaLiveTaskVersion): void {
    this.liveTaskVersionsList.update(liveTaskVersions => {
      return liveTaskVersions.filter(lt => lt.id !== liveTaskVersion.id);
    });
    this.liveTaskVersionStatusEvent.set({
      status: 'waiting'
    });
    this.setLatestLiveTaskVersion(this.liveTask().id);
  }

  public updateLiveTaskVersion(liveTaskVersion: HaLiveTaskVersion): void {
    this.liveTaskVersionsList.update(liveTaskVersions => {
      return liveTaskVersions.map(lt => lt.id === liveTaskVersion.id ? liveTaskVersion : lt);
    });

    if (this.liveTaskVersion().id === liveTaskVersion.id) {
      this.setLiveTaskVersion(liveTaskVersion);
    }
  }

  public getIsLiked(): Signal<boolean> {
    return this.isLiked;
  }

  public setIsLiked(isLiked: boolean): void {
    this.isLiked.set(isLiked);
  }

  public initCoAuthors(): void {
    this.liveTaskService.getCoAuthors(this.liveTask()?.id).subscribe((coAuthors) => {
      this.liveTaskCoAuthors.set(coAuthors);
    });
  }

  private initLiveTask(id: string, paramTitle: string): void {
    this.liveTaskStatusEvent.set({status: 'loading'});
    this.liveTaskService.getLiveTaskById(id).subscribe({
      next: (liveTask) => {
        if (liveTask) {
          this.setLiveTask(liveTask);
          this.liveTaskDescription.set(liveTask.description);
          this.initCoAuthors();
          this.initLiveTaskVersionsList();
          this.initIsLiked();

          if (paramTitle !== ClStringHelper.getCleanUrlPath(this.liveTask().title)) {
            this.httpRedirectionService.redirectTo(
              HaRouterService.getLiveTaskRoute(this.liveTask().id, ClStringHelper.getCleanUrlPath(this.liveTask().title)));
          }
        } else {
          this.liveTaskStatusEvent.set({status: 'error', error: 'live_task_not_found'});
        }
      },
      error: () => {
        this.liveTaskStatusEvent.set({status: 'error', error: 'live_task_not_found'});
      }
    });
  }

  private initLiveTaskVersionsList(): void {
    this.liveTaskService.getPublishedLiveTaskVersions(this.liveTask().id).subscribe(liveTaskVersions => {
      this.liveTaskVersionsList.set(liveTaskVersions);
    });
  }

  private initUser(): void {
    this.authenticatedUserService.getUser().subscribe(user => {
      this.currentUser.set(user);
    });
  }

  private initIsLiked(): void {
    this.likeService.checkIfLiked(HaLikeType.LIVE_TASK_LIKE, this.liveTask().id).subscribe(isLiked => {
      this.setIsLiked(isLiked);
    });
  }

  private checkBrickDependencies(liveTaskVersion: HaLiveTaskVersion): void {
    this.liveTaskService.getLiveTaskVersionBrickDependencies(liveTaskVersion.id).subscribe(brickDependencies => {
      this.brickDependencies.set(brickDependencies);
    });
  }
}
