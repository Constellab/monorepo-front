import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FL_PORTAL_DATA, FlDatasourcePaginated, FlOverlayRef, FlUser} from '@monorepo/front-core-lib';
import {CoAbstractComment, CoCommentEntity, CoCommentType} from '../../model/co-abstract-comment.class';
import {TeBasicConfig, TeRichText, TeRichTextContent, TeTextEditorComponent} from '@monorepo/text-editor';
import {FormControl} from '@ngneat/reactive-forms';
import {CoCommentService} from '../../model/co-comment-service.interface';

export interface CoCommentsPortalData {
  service: CoCommentService;
  entity: CoCommentsEntity;
  commentType: CoCommentType;
  user: FlUser;
}

export interface CoCommentsEntity {
  id: string;
  comments: number;
}
@Component({
  selector: 'co-comments-portal',
  templateUrl: './co-comments-portal.component.html',
  styleUrls: ['./co-comments-portal.component.scss']
})
export class CoCommentsPortalComponent implements OnInit{

  @ViewChild('editorComponent') editorComponent: any;

  commentService: CoCommentService;
  textEditorConfig: TeBasicConfig = new TeBasicConfig();
  // formControl: FormControl<TeRichTextContent> = new FormControl<TeRichTextContent>();
  commentIsValid = false;
  user: FlUser;
  entity: CoCommentsEntity;
  datasource: FlDatasourcePaginated<CoAbstractComment<CoCommentEntity>>;
  isLoading = false;
  commentType: CoCommentType

  constructor(@Inject(FL_PORTAL_DATA) data: CoCommentsPortalData,
              private overlayRef: FlOverlayRef) {
    this.commentService = data.service;
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
    this.commentIsValid = !TeRichText.isEmpty(this.editorComponent?._value);
    this.editorComponent._value = TeRichText.emptyContent();
    console.log(this.editorComponent?._value, this.editorComponent)
  }

  sendComment(): void {
    if (this.commentIsValid){
      this.isLoading = true;
      this.commentService.sendComment(this.commentType, this.editorComponent?._value, this.entity.id)
        .subscribe((comment: CoAbstractComment<CoCommentEntity>) => {
          // this.editorComponent.disable();
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
