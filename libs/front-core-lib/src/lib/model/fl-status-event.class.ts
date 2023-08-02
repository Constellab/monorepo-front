import {Observable, of, startWith} from 'rxjs';
import {catchError, filter, map} from 'rxjs/operators';


export type FlStatusEventType = 'waiting' | 'loading' | 'error' | 'success'

/**
 * Simple class to generify status event (useful for subject with http calls=
 */
export type FlStatusEvent<S = any, E = any> = FlStatusEventSuccess<S>
  | FlStatusEventError<E> | FlStatusEventEmpty

export interface FlStatusEventSuccess<T = any> {
  status: 'success';
  object: T;
}

export interface FlStatusEventError<T = any> {
  status: 'error';
  error: T;
}

export interface FlStatusEventEmpty {
  status: 'waiting' | 'loading';
}

/**
 * Operator to filter FlStatusEvent to return object only when status is success
 */
export function flStatutEventSuccess<T>() {
  return (source: Observable<FlStatusEvent<T>>): Observable<T> => {
    return source.pipe(
      filter((event: FlStatusEvent) => event && event.status === 'success'),
      // if the lowercase flag is true, change the input to lowercase
      map((event: FlStatusEvent) => (event as FlStatusEventSuccess).object),
    );
  };
}

/**
 * Operator to convert a basic observable to a FlStatusEvent observable
 */
export function flStatutEvent<T>() {
  return (source: Observable<T>): Observable<FlStatusEvent<T>> => {
    return source.pipe(
      map((obj: T) => ({status: 'success', object: obj}) as FlStatusEventSuccess<T>),
      catchError((error: any) => (of({status: 'error', error: error} as FlStatusEventError))),
      startWith({status: 'loading'} as FlStatusEventEmpty)
    );
  };
}

// export function flBehaviourSubjectFromObs<T>(obs: Observable<T>): BehaviorSubject<FlStatusEvent<T>> {
//   const subject = new BehaviorSubject<FlStatusEvent<T>>({status: 'loading'});
//   obs.subscribe({
//     next: (value) => subject.next({status: 'success', object: value}),
//     error: (error) => subject.next({status: 'error', error: error})
//   });
//   return subject;
// }
