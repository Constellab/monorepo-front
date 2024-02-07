import {CaBaseEntity} from './ca-base-entity.class';
import {Type} from 'class-transformer';
import {FlDatasourcePaginated} from '@monorepo/front-core-lib';
import {CaProject} from './project/ca-project.class';
import {CaQuillJson} from '../../../ca-project/module/ca-text-editor/model/ca-text-editor.class';


export class CaComment extends CaBaseEntity {
  content: CaQuillJson;

  isResponse: boolean;

  @Type(() => CaComment)
  parentComment: CaComment
}


export class CaProjectComment extends CaComment {
  @Type(() => CaProject)
  project: CaProject;
}


export type CaProjectCommentDatasourcePaginated = FlDatasourcePaginated<CaProjectComment>;
