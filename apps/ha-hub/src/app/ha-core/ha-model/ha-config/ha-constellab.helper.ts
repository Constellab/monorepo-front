import {HaEnvironmentHelper} from './ha-environment.helper';


export class HaConstellabHelper {

  /////////////////////////////// FRONT ///////////////////////////////

  public static getConstellabUrl(): string {
    return HaEnvironmentHelper.getConstellabFrontUrl();
  }

  public static getConstellabSignupUrl(): string {
    return HaConstellabHelper.getConstellabUrl() + '/signup';
  }
}
