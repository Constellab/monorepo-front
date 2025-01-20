import { Component, OnInit } from '@angular/core';

/**
 * Header of the <fl-card> {@link FlCardComponent}
 *
 * Can contain a <fl-card-actions> {@link FlCardActionsComponent}
 */
@Component({
    selector: 'fl-card-header',
    templateUrl: './fl-card-header.component.html',
    styleUrls: ['./fl-card-header.component.scss'],
    standalone: false
})
export class FlCardHeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
