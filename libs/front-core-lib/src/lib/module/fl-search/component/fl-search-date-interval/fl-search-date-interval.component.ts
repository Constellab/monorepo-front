import { Component, OnInit, inject } from '@angular/core';
import { ControlContainer, UntypedFormGroup } from '@angular/forms';

/**
 * Component to use in the search form to create form for a search interval
 */
@Component({
  selector: 'fl-search-date-interval',
  templateUrl: './fl-search-date-interval.component.html',
  styleUrls: ['./fl-search-date-interval.component.scss'],
  standalone: false,
})
export class FlSearchDateIntervalComponent implements OnInit {
  private controlContainer = inject(ControlContainer);

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.controlContainer.control as UntypedFormGroup;
  }
}
