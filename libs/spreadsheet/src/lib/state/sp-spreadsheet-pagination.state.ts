import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { SpSpreadsheetPage, SpSpreadsheetPageLoader } from '../model/sp-spreadsheet-page.class';
import { SpSpreadsheetState } from './sp-spreadsheet.state';
import { Subscription } from 'rxjs';
import { FlPortalActionResult, FlPortalActionsService } from '@monorepo/front-core-lib';

@Injectable()
export class SpSpreadsheetPaginationState implements OnDestroy {
  private static id: number = 0;

  private pagination: SpSpreadsheetPageLoader;

  private nextPageIsLoading: boolean = false;
  private previousPageIsLoading: boolean = false;

  private nextPageSubscription: Subscription;
  private previousPageSubscription: Subscription;
  private readonly id: number;

  constructor(
    private state: SpSpreadsheetState,
    private actionService: FlPortalActionsService,
    private ngZone: NgZone
  ) {
    this.id = SpSpreadsheetPaginationState.id++;
  }

  public init(pagination: SpSpreadsheetPageLoader): void {
    this.pagination = pagination;
    this.nextPageSubscription = this.actionService
      .getResult$(this.getNextPageAction())
      .subscribe((data: FlPortalActionResult) => this.onNextPage(data));

    this.previousPageSubscription = this.actionService
      .getResult$(this.getPreviousPageAction())
      .subscribe((data: FlPortalActionResult) => this.onPreviousPage(data));
  }

  public callNextPage(): void {
    if (this.pagination == null || this.nextPageIsLoading) return;

    const sheet = this.state.currentSheet;

    if (!sheet.hasNextRowsPage()) return;

    this.nextPageIsLoading = true;

    // + 1 because we want to start from the next line of the last line
    const fromRow = sheet.getLastRowsOffsetIndex() + 1;
    this.ngZone.run(() => {
      this.actionService.addAction(
        {
          type: this.getNextPageAction(),
          action: this.pagination.loadRows(fromRow),
          text: { text: 'spSpreadsheet.loading_next_rows', translateText: true },
          additionalInformation: sheet.id,
        },
        true
      );
    });
  }

  public callPreviousPage(): void {
    if (this.pagination == null || this.previousPageIsLoading) return;

    const sheet = this.state.currentSheet;

    if (!sheet.hasPreviousRowsPage()) return;

    this.previousPageIsLoading = true;
    // - 1 because we want to start from the previous line of the first line (offset)
    const toRow = sheet.getFirstRowsOffsetIndex();
    this.ngZone.run(() => {
      this.actionService.addAction(
        {
          type: this.getPreviousPageAction(),
          action: this.pagination.loadPreviousRows(toRow),
          text: { text: 'spSpreadsheet.loading_previous_rows', translateText: true },
          additionalInformation: sheet.id,
        },
        true
      );
    });
  }

  private onNextPage(actionResult: FlPortalActionResult<SpSpreadsheetPage>): void {
    this.nextPageIsLoading = false;

    if (actionResult.status === 'success') {
      const sheet = this.state.getSheet(actionResult.additionalInformation);
      sheet.appendLazyLoadedNextRows(actionResult.result.data, actionResult.result.rows);
    }
  }

  private onPreviousPage(actionResult: FlPortalActionResult<SpSpreadsheetPage>): void {
    this.previousPageIsLoading = false;

    if (actionResult.status === 'success') {
      const sheet = this.state.getSheet(actionResult.additionalInformation);
      sheet.insertLazyLoadedPreviousRows(actionResult.result.data, actionResult.result.rows);
    }
  }

  private getNextPageAction(): string {
    return `sp-load-next-page-${this.id}`;
  }

  private getPreviousPageAction(): string {
    return `sp-load-previous-page-${this.id}`;
  }

  ngOnDestroy(): void {
    this.nextPageSubscription?.unsubscribe();
    this.previousPageSubscription?.unsubscribe();
  }
}
