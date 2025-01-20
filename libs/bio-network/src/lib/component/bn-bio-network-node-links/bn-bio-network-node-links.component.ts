import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BnBioNetworkNode } from '../../model/bn-bio-network-node.class';
import { FlExternalLinkService } from '@monorepo/front-core-lib';

interface Link {
  link: string;
  name: string;
}

/**
 * Component to show a list of biographic links for the pathway node
 * Such as google scholar search, wikipedia...
 */
@Component({
    selector: 'bn-bio-network-node-links',
    templateUrl: './bn-bio-network-node-links.component.html',
    styleUrls: ['./bn-bio-network-node-links.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class BnBioNetworkNodeLinksComponent implements OnInit {
  @Input() set node(node: BnBioNetworkNode) {
    this.setLinks(node);
  }

  links: Link[];

  constructor() {}

  ngOnInit(): void {}

  private setLinks(node: BnBioNetworkNode): void {
    const links: Link[] = [];

    // google scholar search link
    links.push({ name: 'Google scholar', link: FlExternalLinkService.getGoogleArchiveSearch(node.name) });

    // wikipedia search link
    links.push({ name: 'Wikipédia', link: FlExternalLinkService.getWikipediaSearch(node.name) });

    this.links = links;
  }
}
