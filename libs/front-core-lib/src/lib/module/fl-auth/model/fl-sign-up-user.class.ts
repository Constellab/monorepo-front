import {ClUserCategory} from '@monorepo/core-lib';

export interface FlSignUpUser {
  firstname: string;
  lastname: string;
  email: string;
  category: ClUserCategory;
  password: string;
  repeatPassword: string;
  validateCGU: boolean;
  phone?: string;
  captcha?: string;
}
