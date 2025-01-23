import { Component, Input } from '@angular/core';
import { HaCommentTextEditorConfig } from '../../model/ha-comment-text-editor.config';
import { HaRouterService } from '../../../../ha-service/ha-router.service';
import { RouterLink } from '@angular/router';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { TeTextEditorModule } from '@monorepo/text-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
