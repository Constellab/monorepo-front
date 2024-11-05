import { BnBioNetworkLink } from '../model/bn-bio-network-node-link.class';
import { BnBioNetworkMetaboliteLevel } from '../model/bn-bio-network.class';
import { BnBioNetworkOptions } from '../state/bn-bio-network-options.state';
import { BnBioNetworkGraphRenderer } from './bn-bio-network-main.renderer';
import {
  BnBioNetworkObjectColorFunction,
  BnBioNetworkObjectRenderer,
} from './bn-bio-network-object.renderer';
import { Observable } from 'rxjs';
import {
  BnBioNetworkSelectionEvent,
  BnBioNetworkSelectionMode,
} from '../model/bn-bio-network-selection.class';
import { BnBioNetworkNodeCofactor } from '../model/bn-bio-network-node-cofactor.class';
import {
  BnBioNetworkLinkColorFunction,
  BnBioNetworkParticleColor,
} from '../model/bn-bio-network-particle-color.class';
import { BnBioNetworkNode } from '../model/bn-bio-network-node.class';
import { BnBioNetworkNodeReaction } from '../model/bn-bio-network-node-reaction.class';

export class BnBioNetworkLinksRenderer extends BnBioNetworkObjectRenderer {
  constructor(
    graphRenderer: BnBioNetworkGraphRenderer,
    options$: Observable<BnBioNetworkOptions>,
    selection$: Observable<BnBioNetworkSelectionEvent>,
    greyColor: string
  ) {
    super(graphRenderer, options$, selection$, greyColor);
  }

  public render(): void {
    this.graphRenderer.graph;
  }

  protected updateObjectColors(options: BnBioNetworkOptions): void {
    let colorFunc: BnBioNetworkObjectColorFunction;
    if (options.coloredClusters?.length > 0) {
      colorFunc = this.getClusterColorFunction(options.coloredClusters);
    } else {
      colorFunc = null;
    }

    this.setColorFunction(colorFunc);
    const linkColor = new BnBioNetworkParticleColor(
      options.particleColorScale,
      this.graphRenderer.data.getLinksValues(),
      this.greyColor
    );

    // link arrow visibility
    if (options.showArrows) {
      this.graphRenderer.graph
        .linkDirectionalArrowLength((link: BnBioNetworkLink) => {
          // don't show arrows for cross cluster links
          if (link.type === 'cross-cluster-link') return 0;
          return link.isLinkedToCofactor() ? 3 : 10;
        })
        .linkDirectionalArrowRelPos(0.5);
    } else {
      this.graphRenderer.graph.linkDirectionalArrowLength(null);
    }

    // link directional particles
    if (options.showParticles) {
      // particle width from param
      this.graphRenderer.graph.linkDirectionalParticleWidth(options.particleSize);

      // color of the particles based on link value
      this.graphRenderer.graph.linkDirectionalParticleColor((link: BnBioNetworkLink) => {
        // if the link is not selected, always return grey
        if (!link.selected) return this.greyColor;
        return linkColor.getColor(link);
      });

      // get the transformed media of the link values
      const quantile = linkColor.transformValue(linkColor.getQuantile(0.5));

      // nb of particules in a link based on the link value and the length of the link
      this.graphRenderer.graph.linkDirectionalParticles((link: BnBioNetworkLink) => {
        const linkValue = linkColor.transformValue(link.absValue);

        // threshold function to limit density of particles based on link value
        const density = (options.particleDensityThreshold * linkValue) / (quantile + linkValue);

        // have the total number of particle by multiplying by the particle density by the length of the link
        return Math.round(link.getLength() * density);
        // return Math.round((link.absValue * link.getLength()) / (maxValue * 10));
      });

      // speed of the particles based on the link value
      // the speed of the lib is the time the particles take to travel through the link (whatever the length of the link)
      // So we use the link in the calculation to have a speed of the particles that does not depend on the link length
      this.graphRenderer.graph.linkDirectionalParticleSpeed((link: BnBioNetworkLink) => {
        const linkValue = linkColor.transformValue(link.absValue);
        // calculate the speed of the particles based on link length
        // the 5 is used to speed up all the particles
        const speed = (linkValue / link.getLength()) * 5;
        // threshold function to have value between 0 and 0.1
        return (options.particleSpeedThreshold * speed) / (quantile + speed);
      });
    } else {
      // disable the particles
      this.graphRenderer.graph.linkDirectionalParticles(0);
    }

    this.graphRenderer.graph.linkLineDash((link: BnBioNetworkLink) =>
      link.type === 'cross-cluster-link' ? [5, 2] : null
    );
  }

  protected updateVisibility(
    visibleLevels: BnBioNetworkMetaboliteLevel[],
    selectionMode: BnBioNetworkSelectionMode,
    selectedNode: BnBioNetworkNode | null,
    showRelatedCofactor: boolean
  ): void {
    const levelVisibility = this.getLevelVisibilityFunction(visibleLevels, selectionMode);

    let visibilityLink: (object: BnBioNetworkLink) => boolean;

    if (showRelatedCofactor) {
      // show all links and links to cofactors if the cofactor parent reaction is selected
      visibilityLink = (link: BnBioNetworkLink) => {
        if (link.source instanceof BnBioNetworkNodeCofactor) {
          return link.source.showCofactor(visibleLevels);
        } else if (link.target instanceof BnBioNetworkNodeCofactor) {
          return link.target.showCofactor(visibleLevels);
        } else if (link.type === 'cross-cluster-link') {
          if (!selectedNode || !levelVisibility(link)) return false;
          return (
            (selectedNode instanceof BnBioNetworkNodeReaction && link.target.id === selectedNode.id) ||
            link.source.id === selectedNode.id
          );
          // show the cross cluster link for the selected node
          // if (selectedNode && (link.target.id === selectedNode.id || link.source.id === selectedNode.id)) return true;
          // show the cross cluster of the connected reactions
          // return (link.target.selected && link.target.type === 'reaction') || (link.source.selected && link.source.type === 'reaction');
        }
        return link.isVisible && link.type === 'link' && levelVisibility(link);
      };
    } else {
      // only show the visible links of basic type
      visibilityLink = (object: BnBioNetworkLink) =>
        object.isVisible && object.type === 'link' && levelVisibility(object);
    }

    this.graphRenderer.graph.linkVisibility(visibilityLink);
  }

  private setColorFunction(colorFunction: BnBioNetworkLinkColorFunction): void {
    this.graphRenderer.graph.linkColor((link: BnBioNetworkLink) => {
      // if the link is not selected, always return grey
      if (!link.selected || colorFunction == null) return this.greyColor;
      return colorFunction(link);
    });
  }
}
