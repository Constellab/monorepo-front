import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlTag, FlTagValue } from '@monorepo/front-core-lib/fl-tag';
import { ClHelpService } from '@monorepo/core-lib';

/**
 * List all the available values for a tag key
 */
export interface CaTagKey {
  key: string;
  values: FlTagValue[];
}

/**
 * List all the available tags
 */
export interface CaAvailableTags {
  tags: CaTagKey[];
}

export class CaAvailableTagDatasource extends FlArrayObs<CaTagKey> {
  protected equals(a: CaTagKey, b: CaTagKey): boolean {
    return a.key === b.key;
  }

  public addTag(tag: FlTag | FlTag[]): void {
    let array = this.array;

    const tags = ClHelpService.convertObjectOrArrayToArray(tag);
    for (const tag of tags) {
      let tagKey = array.find((tagKey) => tagKey.key === tag.key);
      if (!tagKey) {
        tagKey = { key: tag.key, values: [tag.value] };
        array.push(tagKey);
        array = array.sort((a, b) => ClHelpService.sortAlphabeticalFunction(a.key, b.key));
      } else {
        if (!tagKey.values.includes(tag.value)) {
          tagKey.values.push(tag.value);
          tagKey.values = tagKey.values.sort();
        }
      }
    }
    this.array = array;
  }

  public removeTag(tag: FlTag): void {
    const array = this.array;
    const tagKey = array.find((tagKey) => tagKey.key === tag.key);
    if (tagKey) {
      const index = tagKey.values.indexOf(tag.value);
      if (index >= 0) {
        tagKey.values.splice(index, 1);
        if (tagKey.values.length === 0) {
          const indexKey = array.indexOf(tagKey);
          array.splice(indexKey, 1);
        }
      }

      this.array = array;
    }
  }
}
