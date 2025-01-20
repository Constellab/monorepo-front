import { Pipe, PipeTransform } from '@angular/core';
import { BnBioNetworkLinkHelper } from '../utils/bn-bio-network-link.helper';

/**
 * Simple pipe to generate link from object name and type
 */
@Pipe({
    name: 'bnBioNetworkLink',
    standalone: false
})
export class BnBioNetworkLinkPipe implements PipeTransform {
  transform(value: string, type: 'rhea' | 'chebi' | 'brenda'): string {
    if (!value) return null;

    switch (type) {
      case 'rhea':
        return BnBioNetworkLinkHelper.getRheaDatabaseReactionLink(value);
      case 'chebi':
        return BnBioNetworkLinkHelper.getChebiLink(value);
      case 'brenda':
        return BnBioNetworkLinkHelper.getBrendaLink(value);
      default:
        return null;
    }
  }
}
