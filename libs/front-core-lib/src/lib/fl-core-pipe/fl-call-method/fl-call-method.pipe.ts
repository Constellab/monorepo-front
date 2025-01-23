import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe use to call method on a object. The method is only called when the
 * the object reference is changed. The object passed must be the object containing the method
 * This does not work with getter
 *
 * Example : user | flCallMethod:user.getFullname
 */
@Pipe({
  name: 'flCallMethod',
  standalone: false,
})
export class FlCallMethodPipe implements PipeTransform {
  transform<T>(object: any, method: () => T): T {
    return method.bind(object)();
  }
}
