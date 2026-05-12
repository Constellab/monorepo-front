import { LiBaseEntityWithUser } from '../li-user.entity';

export class LiFormTemplate extends LiBaseEntityWithUser {
  name: string;

  description: string | null;

  public toString(): string {
    return this.name;
  }
}

export interface LiCreateFormTemplateDTO {
  name: string;
  description?: string | null;
  tags?: string[];
}

export interface LiUpdateFormTemplateDTO {
  name?: string;
  description?: string | null;
}
