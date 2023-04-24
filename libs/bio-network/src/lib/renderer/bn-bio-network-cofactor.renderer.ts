import {BnBioNetworkCanvasHelper} from '../utils/bn-bio-network-canvas.helper';
import {BnBioNetworkNodeCofactor} from '../model/bn-bio-network-node-cofactor.class';
import {BnBioNetworkObjectColorFunction} from './bn-bio-network-object.renderer';
import {FlThemeDetail} from '@monorepo/front-core-lib';

/**
 * Draw cofactor node using canvas
 */
export class BnBioNetworkCofactorRenderer {

  public static size: number = 3.5;
  public static strokeWidth: number = 1;

  public static draw(ctx: CanvasRenderingContext2D, cofactor: BnBioNetworkNodeCofactor,
                     colorFunc: BnBioNetworkObjectColorFunction, showText: boolean, themeDetail: FlThemeDetail): void {

    if (!cofactor.selected) {
      ctx.globalAlpha = 0.1;
    } else {
      ctx.globalAlpha = 1;
    }

    const globalRadius = BnBioNetworkCofactorRenderer.size + BnBioNetworkCofactorRenderer.strokeWidth;

    // add white ring
    ctx.fillStyle = themeDetail.foreground;
    BnBioNetworkCanvasHelper.diamond(ctx, cofactor.x, cofactor.y, globalRadius);

    // draw the circle
    if (colorFunc == null) {
      ctx.fillStyle = cofactor.defaultColor;
    } else {
      ctx.fillStyle = colorFunc(cofactor);
    }
    BnBioNetworkCanvasHelper.diamond(ctx, cofactor.x, cofactor.y, BnBioNetworkCofactorRenderer.size);

    // draw the text
    if (showText) {
      ctx.fillStyle = themeDetail.foreground;
      BnBioNetworkCanvasHelper.text(ctx, cofactor.x, cofactor.y + (globalRadius * 1.7), cofactor.data.name,
        {
          fontSize: '0.3em',
          fontFamily: 'Sans-Serif', // todo to fix
          textAlign: 'center',
          shadow: {
            blur: 7,
            color: themeDetail.background,
          }
        });
    }

    ctx.globalAlpha = 1;
  }

  public static drawPointerArea(ctx: CanvasRenderingContext2D, metabolite: BnBioNetworkNodeCofactor, color: string): void {
    // use the unique color for the pointer area
    ctx.fillStyle = color;


    const globalRadius = BnBioNetworkCofactorRenderer.size + BnBioNetworkCofactorRenderer.strokeWidth;

    // simplify area to only select on node
    BnBioNetworkCanvasHelper.diamond(ctx, metabolite.x, metabolite.y, globalRadius);
  }
}
