import { HTTP_INTERCEPTORS, HttpInterceptor } from '@angular/common/http';
import { Directive, inject } from '@angular/core';

import { DcComponentData } from '../../../../core/model/dc-dynamic-component.class';
import { DcHttpInterceptorService } from '../../service/dc-http-interceptor.service';

/**
 * Directive to initialize the main component.
 * It initializes the HttpInterceptor with the authentication info.
 */
@Directive({
  selector: '[dcCoreMain]',
})
export class DcCoreMainDirective {
  private httpInterceptorServices: HttpInterceptor[] = inject(HTTP_INTERCEPTORS) as any;

  public init(data: DcComponentData): void {
    if (data.authentication_info) {
      // Configure the DcHttpInterceptorService
      for (const interceptor of this.httpInterceptorServices) {
        if (interceptor instanceof DcHttpInterceptorService) {
          interceptor.init(data.authentication_info);
        }
      }
    }
  }
}
