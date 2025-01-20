import { Component, Input } from '@angular/core';
import { HaCommentTextEditorConfig } from '../../model/ha-comment-text-editor.config';
import { HaRouterService } from '../../../../ha-service/ha-router.service';

@Component({
    selector: 'ha-comment',
    templateUrl: './ha-comment.component.html',
    styleUrls: ['./ha-comment.component.scss'],
    standalone: false
})
export class HaCommentComponent {
  @Input() comment: any;

  profileRoute = HaRouterService.getProfileRoute();

  textEditorConfig: HaCommentTextEditorConfig = new HaCommentTextEditorConfig();
}
