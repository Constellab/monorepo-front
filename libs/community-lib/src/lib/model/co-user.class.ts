import {FlUserDto} from '@monorepo/front-core-lib';

export class CoUser implements FlUserDto{
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
