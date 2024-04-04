import {Injectable} from '@angular/core';
import {CoServiceConfig} from '@monorepo/community-lib';
import {LabEnvironmentHelper} from '../../utils/lab-environment.helper';

@Injectable({
  providedIn: 'root'
})
export class LabCoServiceConfig extends CoServiceConfig {

  getSpacePhotoUrl(filename: string): string {
    return LabEnvironmentHelper.getSpaceApiUrl() + '/spaces/photo/' + filename;
  }

}
