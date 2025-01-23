import { Component, Input } from '@angular/core';
import { HaCommentTextEditorConfig } from '../../model/ha-comment-text-editor.config';
import { HaRouterService } from '../../../../ha-service/ha-router.service';
import { RouterLink } from '@angular/router';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { FlDateModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';
import { TeTextEditorModule } from '../../../../../../../../../libs/text-editor/src/lib/te-text-editor.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'ha-comment',
  templateUrl: './ha-comment.component.html',
  styleUrls: ['./ha-comment.component.scss'],
  imports: [RouterLink, FlUserModule, FlDateModule, TeTextEditorModule, ReactiveFormsModule, FormsModule],
})
export class HaCommentComponent {
  @Input() comment: any;

  profileRoute = HaRouterService.getProfileRoute();

  textEditorConfig: HaCommentTextEditorConfig = new HaCommentTextEditorConfig();
}
