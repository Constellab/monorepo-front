import {BehaviorSubject, Observable} from 'rxjs';
import {SpSheet} from './sp-sheet.class';

export class SpSpreadsheet {

  private readonly sheets$: BehaviorSubject<SpSheet[]> = new BehaviorSubject([]);
  private readonly currentSheet$: BehaviorSubject<SpSheet> = new BehaviorSubject(null);

  constructor() {
  }

  ///////////////////////////// SHEET //////////////////////////////
  public get currentSheet(): SpSheet {
    return this.currentSheet$.value;
  }

  public getCurrentSheet$(): Observable<SpSheet> {
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
    const sheet: SpSheet = this.getSheet(id);

    if (sheet) {
      this.currentSheet$.next(sheet);
    }
  }

  public getSheet(id: number): SpSheet {
    return this.sheets.find(sheet => sheet.id === id);
  }

  public get sheets(): SpSheet[] {
    return this.sheets$.value;
  }


  public destroy(): void {
    this.sheets$.complete();
    this.currentSheet$.complete();
    this.sheets.forEach(sheet => sheet.destroy());
  }
}
