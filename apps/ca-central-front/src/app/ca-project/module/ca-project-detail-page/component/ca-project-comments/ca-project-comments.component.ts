import { Component, Input } from '@angular/core';


@Component({
  selector: 'ca-project-comments',
  templateUrl: './ca-project-comments.component.html',
  styleUrls: ['./ca-project-comments.component.scss']
})
export class CaProjectCommentsComponent {

  @Input({ required: true }) folderId: string;

}
