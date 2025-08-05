import { CoUser } from '@monorepo/community-lib';
import { ClLuxonDateTimeTransform, ClSupportedLanguage, ClTheme } from '@monorepo/core-lib';
import { FlUser } from '@monorepo/front-core-lib/fl-user';
import { DateTime } from 'luxon';

export class HaUserDetailDto {
  id: string;
  alias: string;
  userCode: string;
  firstname: string;
  lastname: string;
  photo: string;
  githubLink?: string;
  linkedinLink?: string;
  xLink?: string;
  interests?: string;
}

export class HaUser extends CoUser implements FlUser {
  email: string;

  theme: ClTheme;

  @ClLuxonDateTimeTransform()
  createdAt: DateTime;

  lang: ClSupportedLanguage;

  category: HaUserCategory;
}

export enum HaUserCategory {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  PUBLIC_RESEARCH = 'PUBLIC_RESEARCH',
  PRIVATE_INDUSTRY = 'PRIVATE_INDUSTRY',
}
