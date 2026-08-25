import { FlThemeDetail } from '@monorepo/front-core-lib/fl-theme';

import { BN_BIO_NETWORK_COMPARTMENT_BIOMASS_ID } from '../model/bn-bio-network-compartment.class';
import { BnBioNetworkNodeMetabolite } from '../model/bn-bio-network-node-metabolite.class';
import { BnBioNetworkCanvasHelper } from '../utils/bn-bio-network-canvas.helper';
import { BnBioNetworkObjectColorFunction } from './bn-bio-network-object.renderer';

/**
 * Draw metabolite node using canvas
 */
export class BnBioNetworkMetaboliteRenderer {
  public static biomassMetaboliteRadius: number = 8;
  public static minorMetaboliteRadius: number = 3;
  public static majorMetaboliteRadius: number = 6;
  public static existsInMultipleClusterRadius: number = 1.5;
  public static majorMetaboliteStroke: number = 1.5;
  public static minorMetaboliteStroke: number = 0.75;
  public static majorMetaboliteFontSize: string = '0.7em';
  public static minorMetaboliteFontSize: string = '0.4em';

  public static draw(
    ctx: CanvasRenderingContext2D,
    metabolite: BnBioNetworkNodeMetabolite,
    colorFunc: BnBioNetworkObjectColorFunction,
    showText: boolean,
    themeDetail: FlThemeDetail
  ): void {
    // nothing to draw while the node has no position
    const center = metabolite.getCoords();
    if (center.x == null || center.y == null) return;

    if (!metabolite.selected) {
      ctx.globalAlpha = 0.1;
    } else {
      ctx.globalAlpha = 1;
    }

    const centerRadius =
      BnBioNetworkMetaboliteRenderer.getRadius(metabolite) +
      BnBioNetworkMetaboliteRenderer.getStrokeWidth(metabolite);
    const strokeWidth = BnBioNetworkMetaboliteRenderer.getStrokeWidth(metabolite);
    const globalRadius = centerRadius + strokeWidth;

    // add text color ring
    ctx.fillStyle = themeDetail.foreground;
    BnBioNetworkCanvasHelper.circle(ctx, center.x, center.y, globalRadius);

    // draw the circle
    ctx.fillStyle = colorFunc(metabolite);
    BnBioNetworkCanvasHelper.circle(ctx, center.x, center.y, centerRadius);

    // draw the text
    if (showText) {
      ctx.fillStyle = themeDetail.foreground;
      BnBioNetworkCanvasHelper.text(
        ctx,
        center.x,
        center.y + globalRadius * 1.5,
        metabolite.data.name.slice(0, 20),
        {
          fontSize: BnBioNetworkMetaboliteRenderer.getFontTextSize(metabolite),
          fontFamily: 'Sans-Serif', // todo to fix
          textAlign: 'center',
          shadow: {
            blur: 7,
            color: themeDetail.background,
          },
        }
      );
    }

    // if this is a duplicated metabolites, draw a small circle inside it
    if (metabolite.existsInMultipleCluster) {
      ctx.fillStyle = themeDetail.foreground;
      BnBioNetworkCanvasHelper.circle(
        ctx,
        center.x,
        center.y,
        BnBioNetworkMetaboliteRenderer.existsInMultipleClusterRadius
      );
    }

    ctx.globalAlpha = 1;
  }

  public static drawPointerArea(
    ctx: CanvasRenderingContext2D,
    metabolite: BnBioNetworkNodeMetabolite,
    color: string
  ): void {
    const center = metabolite.getCoords();
    if (center.x == null || center.y == null) return;

    // use the unique color for the pointer area
    ctx.fillStyle = color;

    const centerRadius =
      BnBioNetworkMetaboliteRenderer.getRadius(metabolite) +
      BnBioNetworkMetaboliteRenderer.getStrokeWidth(metabolite);
    const strokeWidth = BnBioNetworkMetaboliteRenderer.getStrokeWidth(metabolite);
    const globalRadius = centerRadius + strokeWidth;

    // simplify area to only select on node
    BnBioNetworkCanvasHelper.circle(ctx, center.x, center.y, globalRadius);
  }

  private static getRadius(metabolite: BnBioNetworkNodeMetabolite): number {
    if (metabolite.data.compartment === BN_BIO_NETWORK_COMPARTMENT_BIOMASS_ID)
      return BnBioNetworkMetaboliteRenderer.biomassMetaboliteRadius;
    return metabolite.isMajor()
      ? BnBioNetworkMetaboliteRenderer.majorMetaboliteRadius
      : BnBioNetworkMetaboliteRenderer.minorMetaboliteRadius;
  }

  private static getStrokeWidth(metabolite: BnBioNetworkNodeMetabolite): number {
    return metabolite.isMajor()
      ? BnBioNetworkMetaboliteRenderer.majorMetaboliteStroke
      : BnBioNetworkMetaboliteRenderer.minorMetaboliteStroke;
  }

  private static getFontTextSize(metabolite: BnBioNetworkNodeMetabolite): string {
    return metabolite.isMajor()
      ? BnBioNetworkMetaboliteRenderer.majorMetaboliteFontSize
      : BnBioNetworkMetaboliteRenderer.minorMetaboliteFontSize;
  }
}
