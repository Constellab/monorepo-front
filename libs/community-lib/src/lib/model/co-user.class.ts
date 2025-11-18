import { FlUser } from '@monorepo/front-core-lib/fl-user';

export enum CoUserCertification {
  CERTIFIED = 'CERTIFIED',
  GENCOVERY = 'GENCOVERY',
}

export class CoUser implements FlUser {
  id: string;
  alias: string;
  userCode?: string;
  firstname: string;
  lastname: string;
  photo?: string;
  githubLink?: string;
  linkedinLink?: string;
  xLink?: string;
  interests?: string;
  certification?: CoUserCertification;
}
