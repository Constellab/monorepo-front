import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HaCoreModule } from '../../ha-core.module';
import { HaCommentsPortalComponent } from './component/ha-comments-portal/ha-comments-portal.component';
import { HaCommentComponent } from './component/ha-comment/ha-comment.component';

@NgModule({
  declarations: [HaCommentComponent, HaCommentsPortalComponent],
  exports: [HaCommentComponent, HaCommentsPortalComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HaCoreModule],
})
export class HaCommentsCoreModule {}
