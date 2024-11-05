import { FlUser } from '@monorepo/front-core-lib';

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
}
