import { Component, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CaUser } from '../../../../model/entities/ca-user.class';
import { FL_PORTAL_DATA, FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';
import { FlKeyboardKey } from '@monorepo/front-core-lib/fl-core';
import { BehaviorSubject, combineLatest, distinctUntilChanged, Observable, Subscription, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgClass } from '@angular/common';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';

export interface CaUserMentionPortalInput {
  users$: Observable<CaUser[]>;
  nodeBlock: HTMLElement;
  textNode: Text;
  initialCaretPosition: number;
}

export interface CaUserMentionPortalResult {
  userId: string;
  userFullname: string;
  textNode: Text;
  atPosition: number;
  searchInput: string;
}

@Component({
  selector: 'ca-user-mention-portal',
  templateUrl: './ca-user-mention-portal.component.html',
  styleUrl: './ca-user-mention-portal.component.scss',
  imports: [NgClass, FlUserModule],
})
export class CaUserMentionPortalComponent implements OnInit, OnDestroy {
  private data = inject<CaUserMentionPortalInput>(FL_PORTAL_DATA);
  private overlayRef = inject(FlOverlayRef);
  private renderer = inject(Renderer2);

  showEveryoneButton: number = 0;
  users: CaUser[];

  selectedUserIndex: number = 0;

  private subscription: Subscription;
  private listener: () => void;
  private searchInput: BehaviorSubject<string> = new BehaviorSubject('');

  ngOnInit(): void {
    this.listener = this.renderer.listen(this.data.nodeBlock, 'keydown', (event: KeyboardEvent) => {
      this.handleKeyboardEvent(event);
    });

    const filteredUsers$ = combineLatest([
      this.data.users$,
      this.searchInput.asObservable().pipe(
        distinctUntilChanged(),
        tap((text) => (this.showEveryoneButton = text.length == 0 ? 1 : 0))
      ),
    ]).pipe(
      map(([users, text]) => users.filter((user) => user.alias.toLowerCase().includes(text.toLowerCase())))
    );

    this.subscription = filteredUsers$.subscribe((users: CaUser[]) => this.onUsersChange(users));
  }

  private onUsersChange(users: CaUser[]): void {
    this.users = users;
    this.selectedUserIndex = 0;
  }

  handleKeyboardEvent(event: KeyboardEvent): void {
    if ([FlKeyboardKey.ENTER, FlKeyboardKey.ARROW_DOWN, FlKeyboardKey.ARROW_UP].includes(event.key as any)) {
      if (this.users.length == 0) return;
      event.preventDefault();
      event.stopImmediatePropagation();

      const filteredUserLength = this.users.length + this.showEveryoneButton;

      if (event.key == FlKeyboardKey.ENTER) {
        if (this.users?.length > 0) {
          if (this.selectedUserIndex === 0 && this.showEveryoneButton === 1) {
            this.selectEveryone();
          } else {
            this.selectUser(this.users[this.selectedUserIndex - this.showEveryoneButton]);
          }
        }
      } else if (event.key === FlKeyboardKey.ARROW_DOWN) {
        this.selectedUserIndex++;
        if (this.selectedUserIndex >= filteredUserLength) {
          this.selectedUserIndex = 0;
        }
      } else if (event.key === FlKeyboardKey.ARROW_UP) {
        this.selectedUserIndex--;
        if (this.selectedUserIndex < 0) {
          this.selectedUserIndex = filteredUserLength - 1;
        }
      }
    } else if (event.key === FlKeyboardKey.ARROW_LEFT || event.key === FlKeyboardKey.ARROW_RIGHT) {
      this.overlayRef.dispose();
    } else {
      setTimeout(() => this.handleTextSearch(), 0);
    }
  }

  private handleTextSearch(): void {
    const text = this.data.textNode.wholeText;
    const caretInfo = this.getCaretPosition();

    if (caretInfo < this.data.initialCaretPosition) {
      this.overlayRef.dispose();
      return;
    }

    const textBeforeCaret = text.substring(this.data.initialCaretPosition, caretInfo);
    this.searchInput.next(textBeforeCaret);
  }

  userIsSelected(index: number): boolean {
    return this.selectedUserIndex == index;
  }

  selectEveryone(): void {
    this.selectAndClose('everyone', 'Everyone');
  }

  selectUser(user: CaUser): void {
    this.selectAndClose(user.id, user.alias);
  }

  private selectAndClose(userId: string, userFullname: string): void {
    const result: CaUserMentionPortalResult = {
      userId: userId,
      userFullname: userFullname,
      textNode: this.data.textNode,
      atPosition: this.data.initialCaretPosition,
      searchInput: this.searchInput.value,
    };
    this.overlayRef.dispose(result);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.listener) {
      this.listener();
    }
    this.searchInput.complete();
  }

  private getCaretPosition(): number {
    // Get the current selection
    const selection = window.getSelection();

    if (selection.rangeCount > 0) {
      // Get the first range in the selection
      const range = selection.getRangeAt(0);

      return range.startOffset;
    } else {
      return null;
    }
  }
}
