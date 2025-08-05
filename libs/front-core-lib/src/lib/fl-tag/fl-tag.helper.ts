import { FlColorHelper } from '@monorepo/front-core-lib/fl-core';
import { DateTime } from 'luxon';

import { FlTag, FlTagValue, FlTagWithColor } from './fl-tag.class';

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
