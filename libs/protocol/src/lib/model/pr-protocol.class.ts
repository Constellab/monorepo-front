import { FlCoord } from '@monorepo/front-core-lib/fl-core';
import { TdConfigI, TdSimpleTypeEntity, TdTypeStyle } from '@monorepo/technical-doc';

import { PrOI } from './pr-io.class';
import { PrProcessStatus } from './pr-process.class';

export interface PrProtocolLayout {
  process_layouts: Record<string, FlCoord>;
  interface_layouts: Record<string, FlCoord>;
  outerface_layouts: Record<string, FlCoord>;
}

export interface PrProtocolGraph {
  nodes: Record<string, PrProtocol>;

  links: PrProtocolLink[];

  interfaces: Record<string, PrProtocolIntOut>;

  outerfaces: Record<string, PrProtocolIntOut>;

  layout?: PrProtocolLayout;
}

export interface PrProtocol {
  name: string;

  instance_name: string;

  process_typing_name: string;

  brick_version_on_create: string;

  brick_version_on_run: string;

  config: TdConfigI;

  inputs: PrOI;

  outputs: PrOI;

  // if this is a sub-protocol, this is the graph of the sub-protocol
  graph?: PrProtocolGraph;

  status: PrProcessStatus;

  process_type: TdSimpleTypeEntity;

  style: TdTypeStyle | null;
}

export interface PrProtocolLink {
  from: PrProtocolLinkPart;

  to: PrProtocolLinkPart;
}

export interface PrProtocolIntOut {
  name: string;

  process_instance_name: string;

  port_name: string;
}

export interface PrProtocolLinkPart {
  node: string;

  port: string;
}
