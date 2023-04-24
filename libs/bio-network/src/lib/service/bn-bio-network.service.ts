import {Observable} from 'rxjs';
import {BnBioNetworkMetaboliteLevel} from '../model/bn-bio-network.class';

export interface BnUpdateMetabolite {
  chebi_id: string;
  cluster_id: string;
  x: number;
  y: number;
  level: BnBioNetworkMetaboliteLevel;
}

export abstract class BnBioNetworkService{

  abstract enableSave(): boolean;


  abstract saveMetaboliteLayout(metaboliteInfo: BnUpdateMetabolite): Observable<boolean>;
}
