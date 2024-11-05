import { BnBioNetworkNodeReaction } from '../model/bn-bio-network-node-reaction.class';
import { BnBioNetworkCanvasHelper } from '../utils/bn-bio-network-canvas.helper';
import { BnBioNetworkObjectColorFunction } from './bn-bio-network-object.renderer';
import { FlThemeDetail } from '@monorepo/front-core-lib';

/**
 * Draw reaction node using canvas
 */
export class BnBioNetworkReactionRenderer {
  public static size: number = 4;
  public static strokeWidth: number = 1;
  public static borderRadius: number = 1;
  public static existsInMultipleClusterRadius: number = 0.75;

  public static draw(
    ctx: CanvasRenderingContext2D,
    reaction: BnBioNetworkNodeReaction,
    colorFunc: BnBioNetworkObjectColorFunction,
    themeDetail: FlThemeDetail
  ): void {
    if (!reaction.selected) {
      ctx.globalAlpha = 0.1;
    } else {
      ctx.globalAlpha = 1;
    }

    // add white ring
    ctx.fillStyle = reaction.strokeColor;
    const globalSize = BnBioNetworkReactionRenderer.size + BnBioNetworkReactionRenderer.strokeWidth;
    BnBioNetworkCanvasHelper.roundedRect(
      ctx,
      reaction.x - globalSize / 2,
      reaction.y - globalSize / 2,
      globalSize,
      globalSize,
      BnBioNetworkReactionRenderer.borderRadius
    );

    // draw the rect center
    if (colorFunc == null) {
      ctx.fillStyle = reaction.defaultColor;
    } else {
      ctx.fillStyle = colorFunc(reaction);
    }
    const size = BnBioNetworkReactionRenderer.size;
    BnBioNetworkCanvasHelper.roundedRect(
      ctx,
      reaction.x - size / 2,
      reaction.y - size / 2,
      size,
      size,
      BnBioNetworkReactionRenderer.borderRadius
    );

    // if reaction also exist in another cluster, draw a small circle inside it
    if (reaction.existsInMultipleCluster) {
      ctx.fillStyle = themeDetail.foreground;
      BnBioNetworkCanvasHelper.circle(
        ctx,
        reaction.x,
        reaction.y,
        BnBioNetworkReactionRenderer.existsInMultipleClusterRadius
      );
    }

    ctx.globalAlpha = 1;
  }

  public static drawPointerArea(
    ctx: CanvasRenderingContext2D,
    reaction: BnBioNetworkNodeReaction,
    color: string
  ): void {
    // use the unique color for the pointer area
    ctx.fillStyle = color;

    const globalSize = BnBioNetworkReactionRenderer.size + BnBioNetworkReactionRenderer.strokeWidth;
    BnBioNetworkCanvasHelper.roundedRect(
      ctx,
      reaction.x - globalSize / 2,
      reaction.y - globalSize / 2,
      globalSize,
      globalSize,
      BnBioNetworkReactionRenderer.borderRadius
    );
    ctx.fill();
  }
}
