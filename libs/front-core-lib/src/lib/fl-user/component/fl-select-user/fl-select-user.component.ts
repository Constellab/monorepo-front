import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { FlDatasourcePaginated, FlInputSearchFilter } from '@monorepo/front-core-lib/fl-core';
import { FlFormFieldDirective } from '@monorepo/front-core-lib/fl-core';
import { Observable } from 'rxjs';

import { FlUser } from '../../model/fl-user.class';
import { FlUserConfig, FlUserConfigSearchNameMode } from '../../service/fl-user-config.config';

/**
 * Input/Select component to search for a user and select one.
 * It uses the FlInputSearchComponent to search for users.
 */
@Component({
  selector: 'fl-select-user',
  templateUrl: './fl-select-user.component.html',
  styleUrls: ['./fl-select-user.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: FlSelectUserComponent }],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlSelectUserComponent extends FlFormFieldDirective<FlUser | null> implements OnInit {
  private userConfig = inject(FlUserConfig);

  @Input() placeholder: string;

  @Input() mode: FlUserConfigSearchNameMode = 'space';

  @Output() valueChange: EventEmitter<FlUser | null> = new EventEmitter();

  selectedUser: FlUser | Observable<FlUser> | null;

  usersDatasource: FlDatasourcePaginated<FlUser, FlInputSearchFilter>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  ngOnInit(): void {
    this.usersDatasource = this.userConfig.getSearchByNamesDatasource(this.mode);
  }

  callChangeEvent(value: FlUser | null): void {
    this.valueChange.emit(value);
    this.selectedUser = value;
  }

  onDisableChange(): void {}

  writeValue(obj: FlUser | null): void {
    if (obj == null || obj.id == null) {
      this.selectedUser = null;
      this.value = null;
      return;
    }

    // if the user is not complete
    if (obj.firstname == null || obj.lastname == null) {
      this.selectedUser = this.userConfig.getUserById(obj.id);
    } else {
      // if the user is complete
      this.selectedUser = obj;
    }
    this.value = obj;
  }

  onFocused(selectedUser?: FlUser | null): void {
    // by default add the current user and selected user
    const users: FlUser[] = [];
    if (selectedUser) {
      users.push(selectedUser);
    }

    const currentUser = this.userConfig.getAuthenticatedUser();
    if (selectedUser == null || selectedUser.id !== currentUser.id) {
      users.push(currentUser);
    }

    this.usersDatasource.setPageData(users);
  }
}
