import { Injectable } from '@angular/core';
import { FlTagService } from '@monorepo/front-core-lib/fl-tag';
import { Observable, of } from 'rxjs';
import { clGetEmptyPage, ClPageI } from '@monorepo/core-lib';

/**
 *  TODO TO IMPLEMENT
 *  Service to search tag globally in space, for now disable, we need to decide how to manage it
 */
@Injectable({
  providedIn: 'root',
})
export class CaTagService extends FlTagService {
  searchTag(): Observable<ClPageI<any>> {
    return of(clGetEmptyPage());
  }
}
