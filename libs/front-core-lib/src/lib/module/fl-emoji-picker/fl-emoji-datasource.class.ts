import {FlDatasourcePaginated} from '../../model/datasource/fl-datasource-paginated.class';
import * as data from '@emoji-mart/data';
import {Emoji, EmojiMartData} from '@emoji-mart/data';
import {from, Observable, of} from 'rxjs';
import {ClHelpService, ClPageI} from '@monorepo/core-lib';
import {FrequentlyUsed, SearchIndex} from 'emoji-mart';
import {map} from 'rxjs/operators';


export class FlEmojiHelper {

  public static searchPage(value: string, page: number, pageSize: number): Observable<ClPageI<Emoji>> {
    return this.search(value).pipe(
      map((emojis: Emoji[]) => {
        const start = page * pageSize;
        const end = start + pageSize;
        return {
          objects: emojis.slice(start, end),
          first: page === 0,
          last: end >= emojis.length,
          totalElements: emojis.length,
          currentPage: page,
          pageSize: pageSize
        };
      }),
    );
  }

  private static search(value: string): Observable<Emoji[]> {
    if (ClHelpService.isNullOrEmpty(value)) {
      return of(this.getAllEmojis());
    } else {
      return from(SearchIndex.search(value)).pipe(
        map((emojis: Emoji[]) => {
          if (!emojis) return [];
          return emojis;
        })
      );
    }
  }

  private static getAllEmojis(): Emoji[] {
    return Object.values(this.getEmojiData().emojis);
  }

  public static getFrequentlyUse(): Emoji[] {
    const used: string[] = (FrequentlyUsed as any).get({maxFrequentRows: 4, perLine: 10});
    return used.map((emoji) => this.getEmojiData().emojis[emoji])
      .filter((emoji) => !!emoji);
  }

  public static addInFrequency(emojiId: string): void {
    FrequentlyUsed.add({id: emojiId});
  }

  public static getEmojiData(): EmojiMartData {
    return (data as any).default;
  }
}

export class FlEmojiDatasource extends FlDatasourcePaginated<Emoji> {

  constructor() {
    super((page, pageSize, filter) => FlEmojiHelper.searchPage(filter, page, pageSize), 200);
  }

  protected equals(a: Emoji, b: Emoji): boolean {
    return a.id === b.id;
  }

}
