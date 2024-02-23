import {FlCoord} from '@monorepo/front-core-lib';
import {PrOI} from './pr-io.class';
import {PrProcessStatus} from './pr-process.class';
import {PrConfig} from './pr-config.class';

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
  brick_version: string;

  name: string;

  instance_name: string;

  process_typing_name: string;

  config: PrConfig;

  inputs: PrOI;

  outputs: PrOI;

  // if this is a sub-protocol, this is the graph of the sub-protocol
  graph?: PrProtocolGraph;

  status: PrProcessStatus;

  process_type: {
    human_name: string;
    short_description: string;
  };
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
