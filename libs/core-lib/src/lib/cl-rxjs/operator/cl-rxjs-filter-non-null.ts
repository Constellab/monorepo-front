import { MonoTypeOperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Simple RXJS operator to filter non null properties. Null and undefined properties are ignored
 */
export function clRxjsFilterNonNull<T>(): MonoTypeOperatorFunction<T> {
  return filter((value) => value !== undefined && value !== null);
}
