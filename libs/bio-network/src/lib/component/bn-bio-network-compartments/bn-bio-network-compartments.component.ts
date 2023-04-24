import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BnBioNetworkState} from '../../state/bn-bio-network.state';
import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';
import {BnBioNetworkSelectionState} from '../../state/bn-bio-network-selection.state';
import {BnBioNetworkCompartment} from '../../model/bn-bio-network.class';


/**
 * Component inside the {@link BnBioNetworkComponent} to show the list of compartments and
 * highlight them on click
 */
@Component({
  selector: 'bn-bio-network-compartments',
  templateUrl: './bn-bio-network-compartments.component.html',
  styleUrls: ['./bn-bio-network-compartments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BnBioNetworkCompartmentsComponent implements OnInit {

  compartments$: Observable<BnBioNetworkCompartment[]>;

  private selectedCompartments: Set<string> = new Set();

  constructor(private state: BnBioNetworkState,
              private selectionState: BnBioNetworkSelectionState,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.compartments$ = this.state.getCompartments$();

    // reset the selected compartments on new selection
    this.selectionState.getSelectionMode$().pipe(
      filter(selection => selection.mode !== 'nodesByCompartments')
    ).subscribe(
      () => this.resetSelection()
    );
  }

  private resetSelection(): void {
    this.selectedCompartments.clear();
    this.cdr.markForCheck();
  }

  toggleCompartment(compartment: string): void {
    if (this.selectedCompartments.has(compartment)) {
      this.selectedCompartments.delete(compartment);
    } else {
      this.selectedCompartments.add(compartment);
    }

    this.selectionState.selectNodeByCompartments(Array.from(this.selectedCompartments));
  }

  getCompartmentOpacity(compartment: string): number {
    if (this.selectedCompartments.size === 0) return 1;
    return this.selectedCompartments.has(compartment) ? 1 : 0.1;
  }

}
