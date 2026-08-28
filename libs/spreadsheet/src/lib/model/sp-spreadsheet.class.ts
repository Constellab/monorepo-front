import { BehaviorSubject, Observable } from 'rxjs';

import { SpSheet } from './sp-sheet.class';

export class SpSpreadsheet {
  private readonly sheets$: BehaviorSubject<SpSheet[]> = new BehaviorSubject<SpSheet[]>([]);
  private readonly currentSheet$: BehaviorSubject<SpSheet | null> = new BehaviorSubject<SpSheet | null>(
    null
  );

  ///////////////////////////// SHEET //////////////////////////////
  public get currentSheet(): SpSheet | null {
    return this.currentSheet$.value;
  }

  public getCurrentSheet$(): Observable<SpSheet | null> {
    return this.currentSheet$.asObservable();
  }

  public getSheets$(): Observable<SpSheet[]> {
    return this.sheets$.asObservable();
  }

  public addSheet(sheet: SpSheet): SpSheet {
    // add the sheet
    const sheets: SpSheet[] = this.sheets;
    sheets.push(sheet);
    this.sheets$.next(sheets);

    // select the sheet
    this.selectSheet(sheet.id);
    return sheet;
  }

  public selectSheet(id: number): void {
    if (id === this.currentSheet?.id) return;
    const sheet: SpSheet | undefined = this.getSheet(id);

    if (sheet) {
      this.currentSheet$.next(sheet);
    }
  }

  public getSheet(id: number): SpSheet | undefined {
    return this.sheets.find((sheet) => sheet.id === id);
  }

  public get sheets(): SpSheet[] {
    return this.sheets$.value;
  }

  public destroy(): void {
    this.sheets$.complete();
    this.currentSheet$.complete();
    this.sheets.forEach((sheet) => sheet.destroy());
  }
}
