/**
 * This is used to save a route to use it after a login
 *
 * It is filled when a session_expired error occurred, so if the user login again after
 * the previous route can be retrieve
 */
import { Params } from '@angular/router';

export class FlLoginSavedRoute {
  public static route: string | null = null;

  /**
   * Save a route (path, optionally with query params) to redirect to after login.
   */
  public static setRoute(route: string): void {
    FlLoginSavedRoute.route = route;
  }

  /**
   * return true if a route has been saved
   */
  public static hasRoute(): boolean {
    return FlLoginSavedRoute.route != null && FlLoginSavedRoute.route !== '';
  }

  /**
   * return the path before any '?'
   */
  public static getRoutePath(): string | null {
    const route = FlLoginSavedRoute.route;
    if (route != null && route !== '') {
      return route.split('?')[0];
    } else {
      return null;
    }
  }

  /**
   * return the saved query params as object
   */
  public static getRouteQueryParams(): Params | null {
    const route = FlLoginSavedRoute.route;
    if (route == null || route === '') {
      return null;
    }

    let params = route.split('?')[1];

    if (params == null || params === '') {
      return null;
    }

    // decode url to avoid encoding problem
    params = decodeURIComponent(params);

    const queryParams: Params = {};
    // split all the params
    const stringParams: string[] = params.split('&');

    // for each params
    for (const param of stringParams) {
      // split on '=' to get key and value
      const part: string[] = param.split('=');
      if (part[0] && part[1]) {
        // build the object
        queryParams[part[0]] = part[1];
      }
    }

    return queryParams;
  }

  public static clearRoute(): void {
    FlLoginSavedRoute.route = null;
  }
}
