import { HaEnvironmentHelper } from './ha-environment.helper';

export class HaConstellabHelper {
  /////////////////////////////// FRONT ///////////////////////////////

  public static getConstellabUrl(): string {
    return HaEnvironmentHelper.getConstellabFrontUrl();
  }

  public static getConstellabSignupUrl(): string {
    return HaConstellabHelper.getConstellabUrl() + '/signup';
  }

  public static getGencoveryFOAUrl(): string {
    return 'https://gencovery.com/fair-open-access';
  }

  public static getCommunityDiscordInviteUrl(): string {
    return 'https://discord.com/invite/EASQ28m2dD';
  }
}
