import {Injectable} from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlPortalAction,
  FlPortalActionResult,
  FlPortalActionsService,
  FlTranslatableText,
  FlTranslateService
} from '@monorepo/front-core-lib';
import {Observable, switchMap} from 'rxjs';
import {LabNavigableEntityImpact} from '../../model/entities/lab-navigable-entity.entity';
import {
  LabNavigableImpactDialogComponent,
  LabNavigableImpactDialogInput
} from './component/lab-navigable-impact-dialog/lab-navigable-impact-dialog.component';
import {map} from 'rxjs/operators';

export interface LabNavigableImpactConfig {
  title: FlTranslatableText;
  confirmImpactConfirmText: FlTranslatableText;
  noImpactConfirmText: FlTranslatableText;
  checkImpact: () => Observable<LabNavigableEntityImpact>;
  callAction: () => Observable<any>;
}


export interface LabNavigableCallActionResult<T = any> {
  success: boolean;
  result?: T;
}

@Injectable({
  providedIn: 'root'
})
export class LabNavigableEntityService {

  constructor(private dialogService: FlDialogService,
              private translateService: FlTranslateService,
              private actionService: FlPortalActionsService) {

  }

  /**
   * Method to check the impact of an action and call the action if the user confirms
   * Creates an action and returns an observable that will emit the result of the action
   */
  public callImpactMethodOnAction(data: LabNavigableImpactConfig): Observable<FlPortalActionResult> {
    const obs = this.callImpactMethod(data).pipe(
      map(
        (result: LabNavigableCallActionResult) => {
          // if the call was not a success, mark the action as error
          if (!result.success) throw new Error('Cancel');
          return result.result;
        }
      ));

    const action: FlPortalAction = {
      text: data.title,
      type: 'call-impact',
      action: obs
    };

    return this.actionService.addAction(action);
  }

  /**
   * Method to check the impact of an action and call the action if the user confirms
   * @param data
   */
  public callImpactMethod(data: LabNavigableImpactConfig): Observable<LabNavigableCallActionResult> {
    return data.checkImpact().pipe(
      switchMap((result: LabNavigableEntityImpact) => this.onCheckImpactSuccess(result, data))
    );
  }

  private onCheckImpactSuccess(result: LabNavigableEntityImpact,
                               data: LabNavigableImpactConfig): Observable<LabNavigableCallActionResult> {
    // if no entities are impact
    if (!result.hasEntities) {
      return this.showNoImpactConfirmDialog(data);
    } else {
      return this.showImpactConfirmDialog(result, data);
    }
  }

  private showNoImpactConfirmDialog(data: LabNavigableImpactConfig): Observable<LabNavigableCallActionResult> {
    const input: FlConfirmDialogInput = {
      title: this.translateService.translatableText(data.title),
      content: this.translateService.translatableText(data.noImpactConfirmText),
      translateTitleAndContent: false,
      observable: data.callAction(),
    };

    return this.dialogService.openConfirmDialog(input).afterClosed().pipe(
      map((result: FlConfirmDialogResult) => this.onNoImpactResult(result))
    );
  }

  private onNoImpactResult(result: FlConfirmDialogResult): LabNavigableCallActionResult {
    if (result?.choice) {
      return {
        success: true,
        result: result.result
      };
    }
    return {
      success: false
    };
  }

  private showImpactConfirmDialog(result: LabNavigableEntityImpact,
                                  data: LabNavigableImpactConfig): Observable<LabNavigableCallActionResult> {
    const input: LabNavigableImpactDialogInput = {
      impactedEntities: result.impactedEntities,
      config: data
    };
    // open the impact confirmation dialog
    return this.dialogService.openMediumDialog(LabNavigableImpactDialogComponent, {
      data: input,
      panelClass: 'g-dialog-main-background'
    }).afterClosed().pipe(
      map((result: any) => this.onImpactResult(result))
    );
  }


  private onImpactResult(result?: FlConfirmDialogResult): LabNavigableCallActionResult {
    if (result?.choice) return {
      success: true,
      result: result.result
    };
    return {
      success: false
    };
  }


}

