/**
 * Class to get url of the lab
 */
export class CaLabHelper {
  public static getResourceUrl(labUrl: string, resourceId: string): string {
    return `${labUrl}/app/resource/${resourceId}`;
  }

  public static getScenarioUrl(labUrl: string, scenarioId: string): string {
    return `${labUrl}/app/scenario/${scenarioId}`;
  }
}
