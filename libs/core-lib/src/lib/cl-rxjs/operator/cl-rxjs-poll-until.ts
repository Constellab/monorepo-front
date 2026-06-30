import { Observable, of, throwError, timer } from 'rxjs';
import { first, switchMap, timeout } from 'rxjs/operators';

/**
 * Configuration for {@link clRxjsPollUntil}
 */
export interface ClRxjsPollUntilConfig<T> {
  /**
   * Called on each tick to fetch the current value (e.g. a get request)
   */
  fetch: () => Observable<T>;

  /**
   * Return true when polling should stop and the value should be emitted
   */
  isDone: (value: T) => boolean;

  /**
   * Return true when the value is a terminal error.
   * When it matches, the observable errors (instead of emitting) so that
   * consumers (like the portal action) can render it as an error.
   * Evaluated before {@link isDone}.
   */
  isError?: (value: T) => boolean;

  /**
   * Build the error propagated when {@link isError} matches.
   * Defaults to a generic Error.
   */
  errorFactory?: (value: T) => any;

  /**
   * Delay between ticks in milliseconds (default 5000)
   */
  intervalMs?: number;

  /**
   * Optional safety cap. When provided, the observable errors with a
   * TimeoutError if no terminal value is reached within this duration.
   */
  timeoutMs?: number;
}

/**
 * Generic RXJS factory that polls a source until it reaches a terminal state.
 *
 * It calls {@link ClRxjsPollUntilConfig.fetch} immediately and then every
 * `intervalMs`, using `switchMap` so a slow fetch never overlaps the next tick.
 * It emits (and completes) on the first value matching `isDone`, or errors on
 * the first value matching `isError`.
 *
 * The returned observable is cold: polling starts on subscribe and stops on
 * unsubscribe (no explicit cancellation needed).
 *
 * @param config see {@link ClRxjsPollUntilConfig}
 */
export function clRxjsPollUntil<T>(config: ClRxjsPollUntilConfig<T>): Observable<T> {
  const intervalMs = config.intervalMs ?? 5000;

  let source = timer(0, intervalMs).pipe(
    switchMap(() => config.fetch()),
    switchMap((value: T) => {
      if (config.isError?.(value)) {
        const error = config.errorFactory ? config.errorFactory(value) : new Error('Polling ended in error');
        return throwError(() => error);
      }
      return of(value);
    }),
    first((value: T) => config.isDone(value))
  );

  if (config.timeoutMs != null) {
    source = source.pipe(timeout(config.timeoutMs));
  }

  return source;
}
