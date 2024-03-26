import {Component, Inject, OnInit} from '@angular/core';
import {FL_PORTAL_DATA, FlDatasourcePaginated, FlOverlayRef, FlUser} from '@monorepo/front-core-lib';
import {CoAbstractComment} from '../../model/co-abstract-comment.class';
import {TeBasicConfig, TeRichText, TeRichTextContent} from '@monorepo/text-editor';
import {FormControl} from '@ngneat/reactive-forms';
import {CoCommentService} from '../../model/co-comment-service.interface';

export interface CoCommentsPortalData {
  service: CoCommentService;
  entityId: string;
  user: FlUser;
}

@Component({
  selector: 'co-comments-portal',
  templateUrl: './co-comments-portal.component.html',
  styleUrls: ['./co-comments-portal.component.scss']
})
export class CoCommentsPortalComponent implements OnInit{

  commentService: CoCommentService;
  textEditorConfig: TeBasicConfig = new TeBasicConfig();
  formControl: FormControl<TeRichTextContent> = new FormControl<TeRichTextContent>();
  commentIsValid = false;
  user: FlUser;
  entityId: string;
  datasource: FlDatasourcePaginated<CoAbstractComment>;
  isLoading = false;


  constructor(@Inject(FL_PORTAL_DATA) data: CoCommentsPortalData,
              private overlayRef: FlOverlayRef) {
    this.commentService = data.service;
    this.user = data.user;
    this.entityId = data.entityId;
  }

  ngOnInit(): void {
    this.datasource = this.commentService.getComments(this.entityId);
  }

  closePortal() {
    this.overlayRef.dispose();
  }

  checkCommentValidity(): void {
    this.commentIsValid = !TeRichText.isEmpty(this.formControl.value);
  }

  sendComment() {
    if (this.commentIsValid){
      this.isLoading = true;
      this.commentService.sendComment(this.formControl.value, this.entityId).subscribe((comment: CoAbstractComment) => {
        this.formControl.setValue(null);
        this.datasource.unshiftItem(comment);
        this.isLoading = false;
      });
    }
  }

  loadMoreResults() {
    this.datasource.getNextPage();
  }
}
