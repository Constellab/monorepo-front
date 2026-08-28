import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Shared card shell + header layout for the folder object detail views
 * (note, constellab document, ...).
 *
 * It only owns the visual chrome (outlined card, header row, divider, spacing);
 * each page projects its own divergent pieces through the named slots:
 *  - [ca-detail-card-title]   the title area (icon + title, editable or not)
 *  - [ca-detail-card-actions] the header action buttons (edit / print / more_vert)
 *  - [ca-detail-card-meta]    tags + creation / modification / sync metadata rows
 *  - default content          the body (note content / text editor), left untouched
 */
@Component({
  selector: 'ca-detail-card',
  templateUrl: './ca-detail-card.component.html',
  styleUrls: ['./ca-detail-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaDetailCardComponent {}
