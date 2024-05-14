import {CaBaseEntity} from './ca-base-entity.class';
import {Type} from 'class-transformer';
import {FlDatasourcePaginated} from '@monorepo/front-core-lib';
import {CaProject} from './project/ca-project.class';
import {TeRichTextContent} from '@monorepo/text-editor';


export class CaComment extends CaBaseEntity {
  content: TeRichTextContent;

  isResponse: boolean;

  @Type(() => CaComment)
  parentComment: CaComment;
}


export class CaProjectComment extends CaComment {
  @Type(() => CaProject)
  project: CaProject;
}


export type CaProjectCommentDatasourcePaginated = FlDatasourcePaginated<CaProjectComment>;
