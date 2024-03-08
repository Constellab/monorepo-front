import {SpCell} from './sp-cell.class';
import {ClHelpService, ClStringHelper} from '@monorepo/core-lib';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FlColorHelper, FlTagColorer, FlTagHelper, FlTagWithColor} from '@monorepo/front-core-lib';

export type SpSheetColumnSortDirection = 'Ascending' | 'Descending';

export interface SpSheetHeader {
  index: number;
  name: string;
  tags: Record<string, string>;
  sort?: SpSheetColumnSortDirection;
}


export interface SpSheetRow extends SpSheetHeader {
  cells: SpCell[];
}

// type of the header (mainly for column)
export type SpSheetHeaderType = 'INTEGER' | 'FLOAT' | 'STRING' | 'BOOLEAN' | 'OBJECT';


/**
 * Input object about row or column information
 */
export interface SpSheetHeaderInfoInput {
  name?: string;
  tags?: Record<string, string>;
  type?: SpSheetHeaderType;
}

/**
 * Information about a row or a column in the sheet
 */
export interface SpSheetHeaderInfo {
  name?: string;
  tags?: Record<string, string>;
  tagColorer: FlTagColorer;
  type?: SpSheetHeaderType;
  sort?: SpSheetColumnSortDirection;
}


/**
 * Class to manage columns or rows header infos
 */
export class SpSheetHeaders {

  private readonly _info: SpSheetHeaderInfoInput[];

  public tagColorer: FlTagColorer;

  constructor(info: SpSheetHeaderInfoInput[] = [], private sort?: {
    headerName: string;
    direction: SpSheetColumnSortDirection;
  }) {
    this._info = info;
    this.initTagsColors();
  }

  public getInfo(index: number): SpSheetHeaderInfo {
    // if it doesn't exist, return a default value
    if (!this._info || this._info[index] == null) {
      return {name: '', tags: {}, tagColorer: this.tagColorer, sort: null};
    }
    const headerInfo = this._info[index];
    return {
      name: headerInfo.name,
      tags: headerInfo.tags,
      tagColorer: this.tagColorer,
      type: headerInfo.type,
      sort: this.sort?.headerName === headerInfo.name ? this.sort.direction : null
    };
  }

  /**
   * Set the header info from an index. It overwrites the existing info.
   * @param infos
   * @param fromIndex
   */
  public setInfoFromIndex(infos: SpSheetHeaderInfoInput[], fromIndex: number): void {
    for (let i = 0; i < infos.length; i++) {
      this._info[fromIndex + i] = infos[i];
    }

    // update the tag colors
    const groupedTags = FlTagHelper.groupTagsByKey(this.info.map(info => info.tags));
    this.tagColorer.addTags(groupedTags);
  }

  public hasInfo(index: number): boolean {
    const info = this.getInfo(index);
    return !ClHelpService.isNullOrEmpty(info.name) || !ClHelpService.isNullOrEmpty(info.tags);
  }

  public createInfo(index: number): void {
    if (this.info?.length > 0) {
      this.info.splice(index, 0, this.emptyInfo());
    }
  }

  public deleteInfo(from: number, deleteCount: number): void {
    if (this.info?.length > 0) {
      this.info.splice(from, deleteCount);
    }
  }

  get info(): SpSheetHeaderInfoInput[] {
    return this._info;
  }

  /**
   * Search the name in the header
   * @param name
   */
  public searchByName(name: string): string[] {
    if (!this._info) return [];
    const result = this._info
      .filter(info => info.name && ClStringHelper.stringContains(info.name, name))
      .map(info => info.name);
    return ClHelpService.sortAlphabeticalOrder(result);
  }

  /**
   * Get all the names from index with default to index if the name does not exist
   */
  public getNames(from: number, to: number): string[] {
    if (!this._info) return [];
    const names: string[] = [];
    for (let i = from; i <= to; i++) {
      names.push(this.getInfo(i).name ?? i.toString());
    }
    return names;
  }

  public findIndexByName(name: string): number {
    if (!this._info) return -1;
    return this._info.findIndex(info => info.name === name);
  }

  private emptyInfo(): SpSheetHeaderInfoInput {
    return {name: null, tags: {}};
  }

  private groupTagByKeys(): Record<string, string[]> {
    return FlTagHelper.groupTagsByKey(this.info.map(info => info.tags));
  }

  private initTagsColors(): void {
    const tags = this.groupTagByKeys();
    this.tagColorer = FlTagColorer.fromGroupedTags(tags, FlColorHelper.getColorList());
  }

  public getSelectedIndexTagColors(index: number): Observable<string[]> {
    return this.tagColorer.getSelectedTags$().pipe(
      map(selectedTags => this.getHeaderColors(this.getInfo(index).tags, selectedTags))
    );
  }

  private getHeaderColors(headerTags: Record<string, string>, selectedTags: FlTagWithColor[]): string[] {
    const colors: string[] = [];

    for (const selectedTag of selectedTags) {
      if (headerTags[selectedTag.key] === selectedTag.value) {
        colors.push(selectedTag.color);
      }
    }
    return colors;
  }
}
