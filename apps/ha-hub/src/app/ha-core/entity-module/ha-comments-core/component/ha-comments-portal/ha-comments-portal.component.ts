import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FL_PORTAL_DATA, FlDatasourcePaginated, FlOverlayRef, FlUser} from '@monorepo/front-core-lib';
import {TeBasicConfig, TeRichText, TeRichTextContent} from '@monorepo/text-editor';
import {HaAbstractComment, HaCommentEntity, HaCommentType} from '../../model/ha-abstract-comment.class';
import {HaCommentService} from '../../../../ha-service/ha-comment.service';
import {FormControl} from '@ngneat/reactive-forms';

export interface HaCommentsPortalData {
  entity: HaCommentsEntity;
  commentType: HaCommentType;
  user: FlUser;
}

export interface HaCommentsEntity {
  id: string;
  comments: number;
}
@Component({
  selector: 'ha-comments-portal',
  templateUrl: './ha-comments-portal.component.html',
  styleUrls: ['./ha-comments-portal.component.scss']
})
export class HaCommentsPortalComponent implements OnInit{

  @ViewChild('editorComponent') editorComponent: any;

  textEditorConfig: TeBasicConfig = new TeBasicConfig();
  commentIsValid = false;
  user: FlUser;
  entity: HaCommentsEntity;
  datasource: FlDatasourcePaginated<HaAbstractComment<HaCommentEntity>>;
  isLoading = false;
  commentType: HaCommentType

  constructor(@Inject(FL_PORTAL_DATA) data: HaCommentsPortalData,
              private overlayRef: FlOverlayRef,
              private commentService: HaCommentService) {
    this.user = data.user;
    this.entity = data.entity;
    this.commentType = data.commentType;
  }

  ngOnInit(): void {
    this.datasource = this.commentService.getComments(this.commentType, this.entity.id);
  }

  closePortal(): void {
    this.overlayRef.dispose(this.entity.comments);
  }

  checkCommentValidity(): void {
    this.commentIsValid = !TeRichText.isEmpty(this.editorComponent?.value);
  }

  sendComment(): void {
    if (this.commentIsValid){
      this.isLoading = true;
      this.commentService.sendComment(this.commentType, this.editorComponent?._value, this.entity.id)
        .subscribe((comment: HaAbstractComment<HaCommentEntity>) => {
          this.editorComponent.value = TeRichText.emptyContent();
          this.datasource.unshiftItem(comment);
          this.entity.comments++;
          this.isLoading = false;
        });
    }
  }

  loadMoreResults(): void {
    this.datasource.getNextPage();
  }
}
