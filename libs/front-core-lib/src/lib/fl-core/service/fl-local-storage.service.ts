import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { FlPlatformService } from './fl-plateform.service';

/**
 * Service to manage access the browser local storage
 */
@Injectable({
  providedIn: 'root',
})
export class FlLocalStorageService {
  private platformService = inject(FlPlatformService);

  /**
   * Get an item from the local storage as a string
   * @param key key of the item
   * @return a none parsed string
   */
  public getItem(key: string): string | null {
    if (!this.platformService.isBrowserPlatform()) {
      return null;
    }

    return localStorage.getItem(key);
  }

  /**
   * Get a parsed item from the local storage as an observable
   * @param key key of the item
   * @param defaultValue the default value if the item key does not exist
   * @param removeItemOnParseError if true, it removes the item if a parse error occurs
   */
  public getParseItemObs(
    key: string,
    defaultValue: any = null,
    removeItemOnParseError: boolean = true
  ): Observable<any> {
    return of(this.getParsedItem(key, defaultValue, removeItemOnParseError));
  }

  /**
   * Get a parsed item from the local storage
   * @param key key of the item
   * @param defaultValue the default value if the item key does not exist
   * @param removeItemOnParseError if true, it removes the item if a parse error occurs
   */
  public getParsedItem(key: string, defaultValue: any = null, removeItemOnParseError: boolean = true): any {
    if (!this.platformService.isBrowserPlatform()) {
      return defaultValue;
    }

    try {
      const item: string | null = this.getItem(key);
      if (item == null) {
        return defaultValue;
      }

      return JSON.parse(item) ?? defaultValue;
    } catch {
      if (removeItemOnParseError) {
        this.removeItem(key);
      }
      return defaultValue;
    }
  }

  /**
   * Stringify (if needed) and store the item in the local storage.
   * It updates the item if it already exists
   * @param key key of the new item
   * @param obj item to store
   */
  public setItem(key: string, obj: any): void {
    if (!this.platformService.isBrowserPlatform()) {
      return;
    }

    try {
      if (typeof obj === 'string') {
        localStorage.setItem(key, obj);
      } else {
        localStorage.setItem(key, JSON.stringify(obj));
      }
    } catch {
      console.error('The local storage is not available');
    }
  }

  /**
   * Remove the item from the local storage if it exists
   * @param key key of the item to remove
   */
  public removeItem(key: string): void {
    if (!this.platformService.isBrowserPlatform()) {
      return;
    }

    try {
      localStorage.removeItem(key);
    } catch {
      console.error('The local storage is not available');
    }
  }

  /**
   * Clear all the item from the local storage
   */
  public removeAllItems(): void {
    if (!this.platformService.isBrowserPlatform()) {
      return;
    }
    const items = { ...localStorage };

    try {
      for (const key in items) {
        // eslint-disable-next-line no-prototype-builtins
        if (items.hasOwnProperty(key)) {
          this.removeItem(items[key]);
        }
      }
    } catch {
      console.error('The local storage is not available');
    }
  }
}
