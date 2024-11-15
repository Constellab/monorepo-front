import { FlDatasourcePaginated } from '../../model/datasource/fl-datasource-paginated.class';
import { from, Observable } from 'rxjs';
import { ClHelpService, ClPageI } from '@monorepo/core-lib';
import { FrequentlyUsed, init, SearchIndex } from 'emoji-mart';
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

// types for @emoji-mart/data
export interface FlEmojiMartData {
  categories: FlEmojiMartCategory[];
  emojis: { [key: string]: FlEmojiMartEmoji };
  aliases: { [key: string]: string };
}

export interface FlEmojiMartCategory {
  id: string;
  emojis: string[];
}

export interface FlEmojiMartEmoji {
  id: string;
  name: string;
  keywords: string[];
  skins: FlEmojiMartSkin[];
  version: number;
  emoticons?: string[];
}

export interface FlEmojiMartSkin {
  unified: string;
  native: string;
  x?: number;
  y?: number;
}

export class FlEmojiHelper {
  // help pagination for all emoji
  private static allEmojiLastPageInfo = {
    lastPageIndex: -1,
    nextCategoryIndex: 0,
  };

  private static emojisData: FlEmojiMartData = null;

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

    return allEmojis.pipe(
      map((emojis: FlEmojiCategory[]) => {
        return this.allPaginated2(emojis, page, pageSize);
      })
    );
  }

  public static allPaginated2(
    allEmojis: FlEmojiCategory[],
    page: number,
    pageSize: number
  ): ClPageI<FlEmojiCategory> {
    const totalElementEmojis = allEmojis.reduce((acc, category) => acc + category.emojis.length, 0);

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
        emojis: allEmojis[categoryIndex].emojis,
      });
      remaining -= allEmojis[categoryIndex].emojis.length;
      categoryIndex++;
    }

    this.allEmojiLastPageInfo = {
      lastPageIndex: page,
      nextCategoryIndex: categoryIndex,
    };

    return {
      objects: emojisCategories,
      first: page === 0,
      last: categoryIndex >= allEmojis.length,
      totalElements: totalElementEmojis,
      currentPage: page,
      pageSize: pageSize,
    };
  }

  private static getAllEmojisCategories(): Observable<FlEmojiCategory[]> {
    const emojiData = from(this.getEmojiData());
    return emojiData.pipe(
      map((data: FlEmojiMartData) => {
        return this.getAllEmojisCategories2(data);
      })
    );
  }

  private static getAllEmojisCategories2(emojiData: FlEmojiMartData): FlEmojiCategory[] {
    const categories = emojiData.categories;
    const emojiCategories: FlEmojiCategory[] = [];
    for (const category of categories) {
      const emojis: FlSimpleEmoji[] = category.emojis.map((emojiId, index) => {
        const emoji = emojiData.emojis[emojiId];
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
  public static searchPaginated(
    value: string,
    page: number,
    pageSize: number
  ): Observable<ClPageI<FlEmojiCategory>> {
    return this.searchEmoji(value).pipe(
      map((emojis: FlSimpleEmoji[]) => {
        const end = (page + 1) * pageSize;
        return {
          objects: [
            {
              name: '',
              emojis: emojis.slice(0, end),
            },
          ],
          first: page === 0,
          last: end >= emojis.length,
          totalElements: emojis.length,
          currentPage: page,
          pageSize: pageSize,
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
      map((emojis: FlEmojiMartEmoji[]) => {
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

  public static async getEmojiData(): Promise<FlEmojiMartData> {
    if (FlEmojiHelper.emojisData == null) {
      // load emojis info from emoji-mart
      const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data');
      FlEmojiHelper.emojisData = await response.json();
      init({ data: FlEmojiHelper.emojisData });
    }
    return FlEmojiHelper.emojisData;
  }
}

export interface FlEmojiSearchFilter {
  text: string;
}

export class FlEmojiDatasource extends FlDatasourcePaginated<FlEmojiCategory, FlEmojiSearchFilter> {
  constructor() {
    super(
      (page, pageSize, filter) => FlEmojiHelper.search(filter.filtersCriteria.text, page, pageSize),
      200,
      { initFirstPage: false }
    );
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
