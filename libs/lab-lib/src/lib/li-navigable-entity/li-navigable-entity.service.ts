import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import {
  FlPortalAction,
  FlPortalActionResult,
  FlPortalActionsService,
} from '@monorepo/front-core-lib/fl-portal-actions';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { Injectable, inject } from '@angular/core';
import { LiNavigableEntityImpact } from '@monorepo/lab-lib/li-core';
import {
  LiNavigableImpactDialogComponent,
  LiNavigableImpactDialogInput,
} from './component/li-navigable-impact-dialog/li-navigable-impact-dialog.component';
import { Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

export interface LiNavigableImpactConfig {
  title: FlTranslatableText;
  confirmImpactConfirmText: FlTranslatableText;
  noImpactConfirmText: FlTranslatableText;
  checkImpact: () => Observable<LiNavigableEntityImpact>;
  callAction: () => Observable<any>;
}

export interface LiNavigableCallActionResult<T = any> {
  success: boolean;
  result?: T;
}

@Injectable({
  providedIn: 'root',
})
export class LiNavigableEntityService {
  private dialogService = inject(FlDialogService);
  private actionService = inject(FlPortalActionsService);

  /**
   * Method to check the impact of an action and call the action if the user confirms
   * Creates an action and returns an observable that will emit the result of the action
   */
  public callImpactMethodOnAction(data: LiNavigableImpactConfig): Observable<FlPortalActionResult> {
    const obs = this.callImpactMethod(data).pipe(
      map((result: LiNavigableCallActionResult) => {
        // if the call was not a success, mark the action as error
        if (!result.success) throw new Error('Cancel');
        return result.result;
      })
    );

    const action: FlPortalAction = {
      text: data.title,
      type: 'call-impact',
      action: obs,
    };

    return this.actionService.addAction(action);
  }

  /**
   * Method to check the impact of an action and call the action if the user confirms
   * @param data
   */
  public callImpactMethod(data: LiNavigableImpactConfig): Observable<LiNavigableCallActionResult> {
    return data
      .checkImpact()
      .pipe(switchMap((result: LiNavigableEntityImpact) => this.onCheckImpactSuccess(result, data)));
  }

  private onCheckImpactSuccess(
    result: LiNavigableEntityImpact,
    data: LiNavigableImpactConfig
  ): Observable<LiNavigableCallActionResult> {
    // if no entities are impact
    if (!result.hasEntities) {
      return this.showNoImpactConfirmDialog(data);
    } else {
      return this.showImpactConfirmDialog(result, data);
    }
  }

  private showNoImpactConfirmDialog(data: LiNavigableImpactConfig): Observable<LiNavigableCallActionResult> {
    const input: FlConfirmDialogInput = {
      title: data.title,
      content: data.noImpactConfirmText,
      observable: data.callAction(),
    };

    return this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .pipe(map((result: FlConfirmDialogResult) => this.onNoImpactResult(result)));
  }

  private onNoImpactResult(result: FlConfirmDialogResult): LiNavigableCallActionResult {
    if (result?.choice) {
      return {
        success: true,
        result: result.result,
      };
    }
    return {
      success: false,
    };
  }

  private showImpactConfirmDialog(
    result: LiNavigableEntityImpact,
    data: LiNavigableImpactConfig
  ): Observable<LiNavigableCallActionResult> {
    const input: LiNavigableImpactDialogInput = {
      impactedEntities: result.impactedEntities,
      config: data,
    };
    // open the impact confirmation dialog
    return this.dialogService
      .openMediumDialog(LiNavigableImpactDialogComponent, {
        data: input,
        panelClass: 'g-dialog-main-background',
      })
      .afterClosed()
      .pipe(map((result: any) => this.onImpactResult(result)));
  }

  private onImpactResult(result?: FlConfirmDialogResult): LiNavigableCallActionResult {
    if (result?.choice)
      return {
        success: true,
        result: result.result,
      };
    return {
      success: false,
    };
  }
}
