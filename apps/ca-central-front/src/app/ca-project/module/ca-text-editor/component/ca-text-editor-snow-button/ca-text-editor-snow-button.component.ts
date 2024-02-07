import {Component, OnInit} from '@angular/core';
import {CaTextEditorSnowButton} from '../../model/ca-text-editor.class';
import {CaTextEditorState} from '../../state/ca-text-editor.state';

@Component({
  selector: 'ca-text-editor-snow-button',
  templateUrl: './ca-text-editor-snow-button.component.html',
  styleUrls: ['./ca-text-editor-snow-button.component.scss']
})
export class CaTextEditorSnowButtonComponent implements OnInit {

  buttons: CaTextEditorSnowButton[];

  constructor(private state: CaTextEditorState) {
  }

  ngOnInit(): void {
    this.buttons = this.state.config.getSnowButtons();
  }

  onAction(button: CaTextEditorSnowButton, event: any): void {
    if (!button.onAction) return;
    button.onAction(event, this.state);
  }
}
