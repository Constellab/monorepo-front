import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-credentials-search-form',
  templateUrl: './li-credentials-search-form.component.html',
  styleUrls: ['./li-credentials-search-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, TranslatePipe],
})
export class LiCredentialsSearchFormComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  formGp: UntypedFormGroup;

  ngOnInit(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }
}
