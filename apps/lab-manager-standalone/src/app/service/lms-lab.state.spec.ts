import { TestBed } from '@angular/core/testing';
import { LmlLabManagerState, LmlLabManagerStatus } from '@monorepo/lab-manager-lib';
import { Observable, of, Subject, throwError } from 'rxjs';

import { LmsLabService } from './lms-lab.service';
import { LmsLabState } from './lms-lab.state';

describe('LmsLabState', () => {
  let status$: Subject<LmlLabManagerStatus>;
  let managerStateSpy: { getStatus$: ReturnType<typeof vi.fn>; refreshStatus: ReturnType<typeof vi.fn> };
  let labServiceSpy: {
    labIsRunning: ReturnType<typeof vi.fn>;
    labManagerIsRunning: ReturnType<typeof vi.fn>;
  };

  /** a status as the manager route returns it, with only the fields this state reads set */
  function buildStatus(fields: Partial<LmlLabManagerStatus> = {}): LmlLabManagerStatus {
    return Object.assign(new LmlLabManagerStatus(), fields);
  }

  /**
   * Build the state against the two collaborators it derives everything from.
   *
   * @param labIsRunning what LmsLabService answers for both running checks - an erroring
   * observable covers the catchError fallback the state relies on.
   */
  function buildState(labIsRunning: Observable<boolean> = of(true)): LmsLabState {
    status$ = new Subject<LmlLabManagerStatus>();
    managerStateSpy = {
      getStatus$: vi.fn().mockReturnValue(status$),
      refreshStatus: vi.fn(),
    };
    labServiceSpy = {
      labIsRunning: vi.fn().mockReturnValue(labIsRunning),
      labManagerIsRunning: vi.fn().mockReturnValue(labIsRunning),
    };

    TestBed.configureTestingModule({
      providers: [
        LmsLabState,
        { provide: LmlLabManagerState, useValue: managerStateSpy },
        { provide: LmsLabService, useValue: labServiceSpy },
      ],
    });

    return TestBed.inject(LmsLabState);
  }

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('should ask the manager for a status as soon as it is built', () => {
    buildState();

    expect(managerStateSpy.refreshStatus).toHaveBeenCalledTimes(1);
  });

  it('should start out knowing nothing is configured', () => {
    const state = buildState();

    expect(state.labManagerStatus()).toEqual({
      labManagerIsConfigured: false,
      brickAreConfigured: false,
    });
    expect(state.labIsRunning()).toBe(false);
    expect(state.labManagerIsRunning()).toBe(false);
    expect(state.labIsStarting()).toBe(false);
  });

  it('should read the configuration flags off a new status', () => {
    const state = buildState();

    status$.next(buildStatus({ isInitialized: true, isConfigured: true, labStatus: 'RUNNING' }));

    expect(state.labManagerStatus().labManagerIsConfigured).toBe(true);
    expect(state.labManagerStatus().brickAreConfigured).toBe(true);
  });

  it('should treat a status that omits the flags as not configured', () => {
    const state = buildState();

    status$.next(buildStatus({ labStatus: 'STOPPED' }));

    expect(state.labManagerStatus().labManagerIsConfigured).toBe(false);
    expect(state.labManagerStatus().brickAreConfigured).toBe(false);
  });

  it('should report the lab as starting only while the manager says STARTING', () => {
    const state = buildState();

    status$.next(buildStatus({ labStatus: 'STARTING' }));
    expect(state.labIsStarting()).toBe(true);

    status$.next(buildStatus({ labStatus: 'RUNNING' }));
    expect(state.labIsStarting()).toBe(false);
  });

  it('should refresh both running checks on every status it receives', () => {
    const state = buildState();

    status$.next(buildStatus({ labStatus: 'RUNNING' }));

    expect(labServiceSpy.labIsRunning).toHaveBeenCalledTimes(1);
    expect(labServiceSpy.labManagerIsRunning).toHaveBeenCalledTimes(1);
    expect(state.labIsRunning()).toBe(true);
    expect(state.labManagerIsRunning()).toBe(true);
  });

  it('should fall back to not running when the lab cannot be reached', () => {
    // the lab is down more often than not on this page, and a failing check must not
    // leave the banners claiming it is up
    const state = buildState(throwError(() => new Error('lab unreachable')));

    status$.next(buildStatus({ labStatus: 'ERROR' }));

    expect(state.labIsRunning()).toBe(false);
    expect(state.labManagerIsRunning()).toBe(false);
  });

  it('should stop listening to the manager once destroyed', () => {
    const state = buildState();

    state.ngOnDestroy();
    status$.next(buildStatus({ isInitialized: true }));

    expect(state.labManagerStatus().labManagerIsConfigured).toBe(false);
  });
});
