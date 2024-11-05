import { Observable } from 'rxjs';
import { FlColorHelper } from '../../utils/fl-color-helper.class';
import { DateTime } from 'luxon';
import { FlArrayObs } from '../../model/datasource/fl-array-obs.class';
import { ClPageI } from '@monorepo/core-lib';
import { FlEntity } from '../../model/fl-entity.class';
import { FlDatasourcePaginated } from '../../model/datasource/fl-datasource-paginated.class';

export type FlTagValue = string | number | DateTime;

/**
 * Simple tag with key value
 */
export interface FlTag {
  key: string;
  value?: FlTagValue;
}

export class FlTagDatasource<T extends FlTag = FlTag> extends FlArrayObs<T> {
  protected equals(a: T, b: T): boolean {
    return a.key === b.key && a.value === b.value;
  }
}

export class FlTagDatasourcePaginated<T extends FlTag = FlTag> extends FlDatasourcePaginated<T> {
  protected equals(a: T, b: T): boolean {
    return a.key === b.key && a.value === b.value;
  }
}

export type FlTagValueFormat = 'STRING' | 'INTEGER' | 'FLOAT' | 'DATETIME';

/**
 * Tag information that contains the list of available values for a tag
 */
export interface FlTagKeyModel extends FlEntity {
  key: string;
  isPropagable: boolean;
}

export interface FlTagValueModel extends FlEntity {
  key: string;
  value: FlTagValue;
}

/**
 * Simple tag object with a color
 */
export interface FlTagWithColor {
  key: string;
  value: FlTagValue;
  color: string;
}

/**
 * Event triggered when a tag is selected
 */
export interface FlTagSelectedEvent {
  tag: FlTag;
  event: MouseEvent;
}

export class FlTagHelper {
  public static readonly MAX_LENGTH = 20;

  public static addOrReplaceTag(tags: FlTag[], tag: FlTag): FlTag[] {
    if (!tags) return [tag];

    const existingTag: number = tags.findIndex((t) => t.key === tag.key);
    if (existingTag >= 0) {
      const newTags = [...tags];
      newTags[existingTag] = tag;
      return newTags;
    } else {
      return [...tags, tag];
    }
  }

  /**
   * Group a list of tag by keys
   * @param tagsList
   */
  public static groupTagsByKey(tagsList: Record<string, string>[]): Record<string, string[]> {
    const tags: Record<string, string[]> = {};

    if (tagsList) {
      for (const t of tagsList) {
        for (const key of Object.keys(t)) {
          if (tags[key] == null) {
            tags[key] = [];
          }
          if (tags[key].includes(t[key])) continue;

          tags[key].push(t[key]);
          tags[key] = tags[key].sort();
        }
      }
    }
    return tags;
  }

  /**
   * Convert tag groups to TagWith colors
   * @param tags
   * @param colors
   */
  public static tagGroupsToTagWithColors(tags: Record<string, string[]>, colors: string[]): FlTagWithColor[] {
    const tagsColors: FlTagWithColor[] = [];
    let i = 0;
    Object.keys(tags).forEach((tagKey) => {
      // generate a color for each tag value
      tags[tagKey].forEach((tagValue) => {
        tagsColors.push({
          key: tagKey,
          value: tagValue,
          color: colors[i % colors.length],
        });
        i++;
      });
    });
    return tagsColors;
  }

  public static getTagDefaultColor(key: string): string {
    return FlColorHelper.stringToRGBColor(`${key}${key}${key}`);
  }

  public static tagValueToString(tag: FlTagValue): string {
    if (tag == null) return '';
    if (tag instanceof DateTime) {
      return tag.toISODate();
    } else {
      return tag.toString();
    }
  }
}

export interface FlTagSearchFilter {
  key: string;
  value?: string;
}

export abstract class FlTagService {
  public abstract searchTag(
    filters: Partial<FlTagSearchFilter>,
    page: number,
    pageSize: number
  ): Observable<ClPageI<any>>;
}
