import { Component, input, Input, OnInit } from '@angular/core';
import { TeRichText, TeRichTextContent } from '../../model/te-rich-text.class';
import { BlockToolData } from '@editorjs/editorjs/types/tools';

@Component({
  selector: 'te-titles-list',
  templateUrl: './te-titles-list.component.html',
  styleUrl: './te-titles-list.component.scss',
})
export class TeTitlesListComponent {
  titles = input.required<BlockToolData[]>();
}
