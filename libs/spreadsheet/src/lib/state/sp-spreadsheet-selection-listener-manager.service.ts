import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * Store the subject for a group and how many are registered to it
 */
interface GroupSelected {
  count: number;
  subject: Subject<symbol>;
}

/**
 * Group manager for {@link SpSpreadsheetSelectionListenerComponent}
 * When two components are in the same group they can't be activated at the same time. An activation
 * deactivate other components (like radio button)
 */
@Injectable({ providedIn: 'root' })
export class SpSpreadsheetSelectionListenerManagerService {
  private groups: Map<string, GroupSelected> = new Map();

  public unregisterListener(group: string): void {
    const groupSelected = this.groups.get(group);
    if (groupSelected == null) return;
    groupSelected.count--;

    // if there is not more registered to it, clear the subject and remove group
    if (groupSelected.count === 0) {
      groupSelected.subject.complete();
      this.groups.delete(group);
    }
  }

  /**
   * The children SpSpreadsheetSelectionInputComponent emit its id when it selected
   */
  public emitSelection(group: string, id: symbol): void {
    const groupSelected = this.groups.get(group);
    if (groupSelected == null) return;
    groupSelected.subject.next(id);
  }

  /**
   * Use to subscribe to selection change event
   */
  public subscribeToSelection(group: string): Observable<symbol> {
    let groupSelected = this.groups.get(group);
    if (groupSelected == null) {
      groupSelected = { count: 1, subject: new Subject<symbol>() };
      this.groups.set(group, groupSelected);
    } else {
      groupSelected.count++;
    }
    return groupSelected.subject.asObservable();
  }
}
