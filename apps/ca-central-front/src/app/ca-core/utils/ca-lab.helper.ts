/**
 * Class to get url of the lab
 */
export class CaLabHelper {

  public static getResourceUrl(labUrl: string, resourceId: string): string {
    return `${labUrl}/app/data/resource/${resourceId}`;
  }
}
