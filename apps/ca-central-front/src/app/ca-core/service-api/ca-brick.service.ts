import { Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { LmlBrickVersion } from '@monorepo/lab-manager-lib';

@Injectable({ providedIn: 'root' })
export class CaBrickService {
  private readonly route = 'bricks';

  constructor(private apiService: FlApiService) {}

  public getBrickVersion(brickName: string, brickVersion: string): Observable<LmlBrickVersion> {
    return this.apiService.get(`${this.route}/${brickName}/versions/${brickVersion}`, LmlBrickVersion);
  }
}
