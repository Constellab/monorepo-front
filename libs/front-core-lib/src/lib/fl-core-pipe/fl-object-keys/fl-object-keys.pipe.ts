import { Pipe, PipeTransform } from '@angular/core';

/**
 * Convert an enum to an Array to loop through it
 *
 * It returns the list of keys
 */
@Pipe({
    name: 'flObjectKeys',
    standalone: false
})
export class FlObjectKeysPipe implements PipeTransform {
  transform<T extends string>(data: Record<T, unknown>): T[] {
    if (data == null) return [];
    if (data instanceof Array) {
      return data;
    }
    return Object.keys(data) as T[];
  }
}
