import { FlCoord } from '@monorepo/front-core-lib/fl-core';

/**
 * Complete Structured data of a pathway
 */
export interface BnBioNetwork {
  name?: string;
  metabolites: BnBioNetworkMetabolite[];
  reactions: BnBioNetworkReaction[];
  compartments: BnBioNetworkCompartment[];
}

// Level of the metabolite 3 = cofactor
// The lower the level, the more important the metabolite is
export enum BnBioNetworkMetaboliteLevel {
  MAJOR = 1,
  MINOR = 2,
  COFACTOR = 3,
}

export interface BnBioNetworkObject {
  id: string;
  name: string;
  level: BnBioNetworkMetaboliteLevel;
}

export type BnBioNetworkMetaboliteType = 'default' | 'cofactor' | 'residue';

export interface BnBioNetworkMetabolite extends BnBioNetworkObject {
  compartment: string;
  charge?: any;
  mass?: any;
  formula?: string;
  chebi_id?: string;
  layout?: BnBioNetworkLayout;

  type: BnBioNetworkMetaboliteType;
}

export function bnBioNetworkIsCofactor(type: BnBioNetworkMetaboliteType): boolean {
  return type === 'cofactor' || type === 'residue';
}

export interface BnBioNetworkReaction extends BnBioNetworkObject {
  metabolites: Record<string, number>;
  lower_bound?: number;
  upper_bound?: number;
  enzymes: BnBioNetworkEnzyme[];
  data: BnBioNetworkReactionData;
  layout?: FlCoord;
  rhea_id?: string;
}

export interface BnBioNetworkLayout {
  // x: number;
  // y: number;
  clusters: Record<string, BnBioNetworkCluster>;
}

export interface BnBioNetworkCluster extends FlCoord {
  x: number;
  y: number;
  level: BnBioNetworkMetaboliteLevel;
  name: string;
  id: string;
}

export interface BnBioNetworkCompartment {
  id: string;
  go_id: string;
  bigg_d: string;
  name: string;
  color: string;
}

// TODO rename and review format with cluster
export interface BnBioNetworkClusterInfo {
  clusterId: string;
  subClusterIds: string[];
}

// info of which enzyme the reaction is
export interface BnBioNetworkEnzyme {
  name: string;
  ec_number: string;
  pathways: BnBioNetworkPathways;
}

// list of database ref for a pathway
export type BnPathwayDatabase = keyof BnBioNetworkPathways;

// info of which pathway the reaction is
// It define the pathway name based for known DB (EU, US, Japan)
export interface BnBioNetworkPathways {
  brenda?: BnBioNetworkPathwayDetail;
  kegg?: BnBioNetworkPathwayDetail;
  metacyc?: BnBioNetworkPathwayDetail;
}

export interface BnBioNetworkPathwayDetail {
  // list of ids of the pathways separated by the separator
  id: string;
  // list of names of the pathways separated by the separator
  name: string;
}

// TODO to improve when the cluster will be fully activated
export interface BnBioNetworkClusterSelection {
  id: string;
  name: string;
  selected: boolean;
  highlighted: boolean;
  color: string;
}

export interface BnBioNetworkReactionData {
  simulations?: Record<string, BnBioNetworkReactionDataFlux>;
}

export interface BnBioNetworkReactionDataFlux {
  value: number;
  lower_bound: number;
  upper_bound: number;
  // labels?: [];
}
