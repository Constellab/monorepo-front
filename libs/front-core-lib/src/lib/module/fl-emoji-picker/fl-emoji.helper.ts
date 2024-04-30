import {FlDatasourcePaginated} from '../../model/datasource/fl-datasource-paginated.class';
import * as data from '@emoji-mart/data';
import {Emoji, EmojiMartData} from '@emoji-mart/data';
import {from, Observable, of} from 'rxjs';
import {ClHelpService, ClPageI} from '@monorepo/core-lib';
import {FrequentlyUsed, SearchIndex} from 'emoji-mart';
import {map} from 'rxjs/operators';

export interface FlEmojiCategory {
  name: string;
  emojis: FlSimpleEmoji[];
}

export interface FlSimpleEmoji {
  id: string;
  emoji: string;
}


export class FlEmojiHelper {

  public static search(value: string, page: number, pageSize: number): Observable<ClPageI<FlEmojiCategory>> {
    if (ClHelpService.isNullOrEmpty(value)) {
      return this.allPaginated(page, pageSize);
    } else {
      return this.searchPaginated(value, page, pageSize);
    }
  }

  /**
   * Get all emojis paginated
   * It return all the emojis from page 0 to the end
   * @param page
   * @param pageSize
   */
  public static allPaginated(page: number, pageSize: number): Observable<ClPageI<FlEmojiCategory>> {
    const allEmojis = this.getAllEmojisCategories();

    const totalElementEmojis = allEmojis.reduce((acc, category) =>
      acc + category.emojis.length, 0);

    const emojis: FlEmojiCategory[] = [];

    let end = (page + 1) * pageSize;
    let index = 0;
    let count = 0;
    while (end > 0 && index < allEmojis.length) {
      if (end >= allEmojis.length) {
        emojis.push(allEmojis[index]);
        count += allEmojis[index].emojis.length;
      } else {
        const categorySlice = allEmojis[index].emojis.slice(0, end);
        emojis.push({
          name: allEmojis[index].name,
          emojis: categorySlice
        });
        count += categorySlice.length;
      }
      end -= allEmojis[index].emojis.length;
      index++;
    }

    return of({
      objects: emojis,
      first: page === 0,
      last: count >= totalElementEmojis,
      totalElements: totalElementEmojis,
      currentPage: page,
      pageSize: pageSize
    });
  }

  private static getAllEmojisCategories(): FlEmojiCategory[] {
    const categories = this.getEmojiData().categories;
    const emojiCategories: FlEmojiCategory[] = [];
    for (const category of categories) {
      const emojis: FlSimpleEmoji[] = category.emojis.map((emojiId) => {
        const emoji = this.getEmojiData().emojis[emojiId];
        return {id: emoji.id, emoji: emoji.skins[0].native};
      });
      emojiCategories.push({name: category.id, emojis});
    }

    return emojiCategories;
  }

  /**
   * Search emojis paginated, it returns all the emojis that match the value
   * return the emojis from page 0 to the end
   * @param value
   * @param page
   * @param pageSize
   */
  public static searchPaginated(value: string, page: number, pageSize: number): Observable<ClPageI<FlEmojiCategory>> {
    return this.searchEmoji(value).pipe(
      map((emojis: FlSimpleEmoji[]) => {
        const end = (page + 1) * pageSize;
        return {
          objects: [{
            name: '',
            emojis: emojis.slice(0, end)
          }],
          first: page === 0,
          last: end >= emojis.length,
          totalElements: emojis.length,
          currentPage: page,
          pageSize: pageSize
        };
      }),
    );
  }

  private static searchEmoji(value: string): Observable<FlSimpleEmoji[]> {
    // specific case to support the base smiley
    const specificChars = ['(', ')', 'o', 'd', 's', 'p', '/'];
    if (value.length === 1 && specificChars.includes(value.toLowerCase())) {
      value = `:${value}`;
    }

    return from(SearchIndex.search(value)).pipe(
      map((emojis: Emoji[]) => {
        if (!emojis) return [];
        return emojis.map((emoji) => {
          return {id: emoji.id, emoji: emoji.skins[0].native} as FlSimpleEmoji;
        });
      })
    );
  }

  public static addInFrequency(emojiId: string): void {
    FrequentlyUsed.add({id: emojiId});
  }

  public static getEmojiData(): EmojiMartData {
    return (data as any).default;
  }
}

export class FlEmojiDatasource extends FlDatasourcePaginated<FlEmojiCategory> {

  constructor() {
    super((page, pageSize, filter) =>
      FlEmojiHelper.search(filter, page, pageSize), 200, false);
  }

  protected equals(a: FlEmojiCategory, b: FlEmojiCategory): boolean {
    return a.name === b.name;
  }

}
