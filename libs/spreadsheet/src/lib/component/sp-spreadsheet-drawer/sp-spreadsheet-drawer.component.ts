import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { SpSpreadsheetState } from '../../state/sp-spreadsheet.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SpSheet } from '../../model/sp-sheet.class';
import { flCdkOverlayContainerClass, FlTagColorer } from '@monorepo/front-core-lib';

@Component({
  selector: 'sp-spreadsheet-drawer',
  templateUrl: './sp-spreadsheet-drawer.component.html',
  styleUrls: ['./sp-spreadsheet-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SpSpreadsheetDrawerComponent implements OnInit {
  private drawer = inject(MatDrawer);
  private state = inject(SpSpreadsheetState);

  pinDrawer: boolean = false;

  currentSheet$: Observable<SpSheet>;

  columnTagsColorer$: Observable<FlTagColorer>;
  rowTagsColorer$: Observable<FlTagColorer>;

  // use to ignore the mouse event on the CDK to keep the drawer open if an overlay is opened
  cdkContainerClass: string = flCdkOverlayContainerClass;

  ngOnInit(): void {
    this.currentSheet$ = this.state.currentSheet$;
    this.columnTagsColorer$ = this.state.currentSheet$.pipe(map((sheet) => sheet.columns.tagColorer));

    this.rowTagsColorer$ = this.state.currentSheet$.pipe(map((sheet) => sheet.rows.tagColorer));
  }

  closeDrawer(): void {
    this.drawer.close();
  }
}
