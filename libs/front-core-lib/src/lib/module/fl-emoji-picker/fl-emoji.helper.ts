import { FlDatasourcePaginated } from '../../model/datasource/fl-datasource-paginated.class';
import * as data from '@emoji-mart/data';
import { Emoji, EmojiMartData } from '@emoji-mart/data';
import { from, Observable, of } from 'rxjs';
import { ClHelpService, ClPageI } from '@monorepo/core-lib';
import { FrequentlyUsed, SearchIndex } from 'emoji-mart';
import { map } from 'rxjs/operators';

export interface FlEmojiCategory {
  name: string;
  emojis: FlSimpleEmoji[];
}

export interface FlSimpleEmoji {
  id: string;
  emoji: string;
  htmlId: string;
}


export class FlEmojiHelper {

  // help pagination for all emoji
  private static allEmojiLastPageInfo = {
    lastPageIndex: -1,
    nextCategoryIndex: 0
  };

  public static search(value: string, page: number, pageSize: number): Observable<ClPageI<FlEmojiCategory>> {
    if (ClHelpService.isNullOrEmpty(value)) {
      return this.allPaginated(page, pageSize);
    } else {
      return this.searchPaginated(value, page, pageSize);
    }
  }

  /**
   * Get all emojis paginated
   * It returns emoji whole categories,
   * @param page
   * @param pageSize
   */
  public static allPaginated(page: number, pageSize: number): Observable<ClPageI<FlEmojiCategory>> {
    const allEmojis = this.getAllEmojisCategories();

    const totalElementEmojis = allEmojis.reduce((acc, category) =>
      acc + category.emojis.length, 0);

    const emojisCategories: FlEmojiCategory[] = [];

    let categoryIndex: number = 0;

    // if this is the next page as the last one, we start from the last category index
    if (this.allEmojiLastPageInfo.lastPageIndex + 1 === page) {
      categoryIndex = this.allEmojiLastPageInfo.nextCategoryIndex;
    }

    // the number of remaining emojis to add in the page
    let remaining = pageSize;
    while (remaining > 0 && categoryIndex < allEmojis.length) {
      // push the whole category (we round the page per category)
      emojisCategories.push({
        name: allEmojis[categoryIndex].name,
        emojis: allEmojis[categoryIndex].emojis
      });
      remaining -= allEmojis[categoryIndex].emojis.length;
      categoryIndex++;
    }

    this.allEmojiLastPageInfo = {
      lastPageIndex: page,
      nextCategoryIndex: categoryIndex
    };

    return of({
      objects: emojisCategories,
      first: page === 0,
      last: categoryIndex >= allEmojis.length,
      totalElements: totalElementEmojis,
      currentPage: page,
      pageSize: pageSize
    });
  }


  private static getAllEmojisCategories(): FlEmojiCategory[] {
    const categories = this.getEmojiData().categories;
    const emojiCategories: FlEmojiCategory[] = [];
    for (const category of categories) {
      const emojis: FlSimpleEmoji[] = category.emojis.map((emojiId, index) => {
        const emoji = this.getEmojiData().emojis[emojiId];
        return { id: emoji.id, emoji: emoji.skins[0].native, htmlId: `${category.id}-${index}` };
      });
      emojiCategories.push({ name: category.id, emojis });
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
      })
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
        return emojis.map((emoji, index) => {
          return { id: emoji.id, emoji: emoji.skins[0].native, htmlId: `emoji-${index}` };
        });
      })
    );
  }

  public static addInFrequency(emojiId: string): void {
    FrequentlyUsed.add({ id: emojiId });
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

  public findByHtmlId(htmlId: string): FlSimpleEmoji | null {
    for (const category of this.array) {
      for (const emoji of category.emojis) {
        if (emoji.htmlId === htmlId) {
          return emoji;
        }
      }
    }
    return null;
  }
}
