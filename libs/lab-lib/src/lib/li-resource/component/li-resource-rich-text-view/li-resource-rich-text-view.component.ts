import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LiConfig, LiResourceViewRichText } from '@monorepo/lab-lib/li-core';
import { RvResourceViewDirective } from '@monorepo/resource-view';
import { TeConfig, TeRichText, TeTextEditorModule } from '@monorepo/text-editor';

@Component({
  selector: 'li-resource-rich-text-view',
  templateUrl: './li-resource-rich-text-view.component.html',
  styleUrls: ['./li-resource-rich-text-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TeTextEditorModule, ReactiveFormsModule, FormsModule],
})
export class LiResourceRichTextViewComponent
  extends RvResourceViewDirective<LiResourceViewRichText>
  implements OnInit
{
  private liConfig = inject(LiConfig);
  textEditorConfig: TeConfig;

  richText: TeRichText;

  ngOnInit(): void {
    this.textEditorConfig = this.liConfig.buildRichTextViewEditorConfig(this.view, this.resourceId);

    this.richText = new TeRichText(this.view.data.content);
  }
}
