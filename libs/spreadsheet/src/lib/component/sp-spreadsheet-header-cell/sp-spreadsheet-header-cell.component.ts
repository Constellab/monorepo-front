import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';
import { SpSpreadsheetSelectionState } from '../../state/sp-spreadsheet-selection.state';
import { Observable, Subscription } from 'rxjs';
import { SpSheetSingleSelection } from '../../model/selection/sp-sheet-single-selection.class';
import {
  FlHeaderCellType,
  headerIndexAttributeName,
  headerTypeAttributeName,
} from '../../model/sp-cell.class';
import { SpSpreadsheetState } from '../../state/sp-spreadsheet.state';
import { SpSpreadsheetHeaderInfoComponent } from '../sp-spreadsheet-header-info/sp-spreadsheet-header-info.component';
import { SpSheetHeader, SpSheetHeaderInfo } from '../../model/sp-sheet-headers.class';
import { FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalConnectedPosition } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';

@Component({
  selector: 'sp-spreadsheet-header-cell',
  templateUrl: './sp-spreadsheet-header-cell.component.html',
  styleUrls: ['./sp-spreadsheet-header-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SpSpreadsheetHeaderCellComponent implements OnInit, OnDestroy {
  private state = inject(SpSpreadsheetState);
  private selectionState = inject(SpSpreadsheetSelectionState);
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);
  private portalService = inject(FlPortalService);

  @HostBinding('attr.' + headerIndexAttributeName)
  @Input()
  index: number;

  @Input() header: SpSheetHeader;

  // if the header cell is a row or a column
  @HostBinding('attr.' + headerTypeAttributeName)
  @Input()
  type: FlHeaderCellType;

  colors$: Observable<string[]>;

  subscription: Subscription;

  private overlayRef: FlOverlayRef;

  ngOnInit(): void {
    this.subscribeToSelection();
    this.subscribeToColor();
  }

  private subscribeToSelection(): void {
    this.subscription = this.selectionState
      .getSelection$()
      .subscribe((selection) => this.onSelectionChange(selection));
  }

  private onSelectionChange(selection: SpSheetSingleSelection): void {
    if (selection == null) {
      this.renderer.removeClass(this.elementRef.nativeElement, this.getSelectedClass());
    } else {
      if (this.isSelected(selection)) {
        this.renderer.addClass(this.elementRef.nativeElement, this.getSelectedClass());
      } else {
        this.renderer.removeClass(this.elementRef.nativeElement, this.getSelectedClass());
      }
    }
  }

  // return true is the current row or column is selected based on a selection event
  private isSelected(selection: SpSheetSingleSelection): boolean {
    if (this.type === 'column') {
      return selection.columnIsSelected(this.index);
    } else {
      return selection.rowIsSelected(this.index);
    }
  }

  private getSelectedClass(): string {
    return this.type === 'column' ? 'column-selected' : 'row-selected';
  }

  /////////////////////////////// TAG COLORS ///////////////////////////////
  private subscribeToColor(): void {
    if (this.type === 'row') {
      this.colors$ = this.state.currentSheet.rows.getSelectedIndexTagColors(this.index);
    } else {
      this.colors$ = this.state.currentSheet.columns.getSelectedIndexTagColors(this.index);
    }
  }

  /////////////////////////////// HEADER INFO ///////////////////////////////

  openHeaderPortal(): void {
    const sheet = this.state.currentSheet;
    let headerInfo: SpSheetHeaderInfo = null;
    if (this.type === 'row') {
      if (sheet.rowHasInfo(this.index)) {
        headerInfo = sheet.getRowInfo(this.index);
      }
    } else {
      if (sheet.columnHasInfo(this.index)) {
        headerInfo = sheet.getColumnInfo(this.index);
      }
    }

    // if there is no header info, do nothing
    if (!headerInfo) return;
    this.openHeaderInfoPortal(headerInfo);
  }

  private openHeaderInfoPortal(headerInfo: SpSheetHeaderInfo): void {
    const positions: FlPortalConnectedPosition[] =
      this.type === 'row' ? ['bottom', 'top', 'right', 'left'] : ['right', 'left', 'top', 'bottom'];

    const config = this.portalService.configureRelativePortal(this.elementRef.nativeElement, positions, {
      disposeOnNavigation: true,
      disposeOnOutsideClick: true,
    });

    this.overlayRef = this.portalService.createPortal(SpSpreadsheetHeaderInfoComponent, config, headerInfo);
  }

  closePortal(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.closePortal();
  }
}
