import { Component, Input, OnInit, inject } from '@angular/core';
import { FlPortalActionDetail, FlPortalActionDetailStatusEvent } from '../../model/fl-portal-actions.class';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Component inside {@link FlPortalActionsComponent} that subscribe
 * and show loader for one observable
 */
@Component({
  selector: 'fl-portal-action-line',
  templateUrl: './fl-portal-action-line.component.html',
  styleUrls: ['./fl-portal-action-line.component.scss'],
  standalone: false,
})
export class FlPortalActionLineComponent implements OnInit {
  private translateService = inject(FlTranslateService);

  @Input() action: FlPortalActionDetail;

  statusEvent$: Observable<FlPortalActionDetailStatusEvent>;
  link$: Observable<string | null>;

  text: string;

  ngOnInit(): void {
    // translate the text if necessary
    this.text = this.translateService.translatableText(this.action.text);
    this.statusEvent$ = this.action.getStatusEvent$();
    this.link$ = this.action
      .getResult$()
      .pipe(map((result) => (result.status === 'success' ? result.link : null)));
  }
}
