import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FlTranslateService} from '../module/fl-translate/service/fl-translate.service';

@Injectable()
export class FlHttpInterceptorService implements HttpInterceptor {

  constructor(private translateService: FlTranslateService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add lang to the headers

    const lang: string = this.translateService.getUserLanguage();

    // check if it's a public route
    if (req.url.split('/')[3] == 'public') {
      return next.handle(req);
    }

    req = req.clone({
      withCredentials: true,
      headers: req.headers ? req.headers.append('lang', lang) : new HttpHeaders({
        lang: lang
      })
    });
    return next.handle(req);
  }
}
