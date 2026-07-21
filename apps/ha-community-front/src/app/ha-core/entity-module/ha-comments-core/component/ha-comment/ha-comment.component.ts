import { ChangeDetectionStrategy,Component, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TeCompleteConfig, TeTextEditorModule } from '@monorepo/text-editor';

import { HaRouterService } from '../../../../ha-service/ha-router.service';
import { HaAbstractComment, HaCommentEntity } from '../../model/ha-abstract-comment.class';

@Component({
  selector: 'ha-comment',
  templateUrl: './ha-comment.component.html',
  styleUrls: ['./ha-comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink, FlUserModule, FlDateModule, TeTextEditorModule, ReactiveFormsModule, FormsModule],
})
export class HaCommentComponent {
  comment = input.required<HaAbstractComment<HaCommentEntity>>();

  profileRoute = HaRouterService.getProfileRoute();

  textEditorConfig: TeCompleteConfig = new TeCompleteConfig({ hideToolbar: true, dense: true });
}
