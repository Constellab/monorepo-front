import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { BnBioNetworkState } from '../../state/bn-bio-network.state';
import { filter, Observable } from 'rxjs';
import { BnBioNetworkGraph } from '../../model/bn-bio-network-graph.class';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { BnBioNetworkObject } from '../../model/bn-bio-network.class';
import { BnBioNetworkSelectionState } from '../../state/bn-bio-network-selection.state';
import { ClHelpService, ClStringHelper, ClSubscriptionHandler } from '@monorepo/core-lib';
import { BnBioNetworkDrawerState } from '../../state/bn-bio-network-drawer.state';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';

/**
 * Component to search on metabolite and reactions and select the object
 */
@Component({
  selector: 'bn-bio-network-node-search',
  templateUrl: './bn-bio-network-node-search.component.html',
  styleUrls: ['./bn-bio-network-node-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class BnBioNetworkNodeSearchComponent implements OnInit, OnDestroy {
  private state = inject(BnBioNetworkState);
  private selectionState = inject(BnBioNetworkSelectionState);
  private drawerState = inject(BnBioNetworkDrawerState);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

  objects: BnBioNetworkObject[];
  filteredObjects$: Observable<BnBioNetworkObject[]>;

  searchControl: FormControl<string | BnBioNetworkObject> = new FormControl();

  private subscription: ClSubscriptionHandler = new ClSubscriptionHandler();

  ngOnInit(): void {
    this.getChartData();

    // Observable that refresh the filteredOptions each time a key is typed
    this.filteredObjects$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      map((value: string | BnBioNetworkObject) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this.filter(name) : this.objects.slice()))
    );

    // use to close the autocomplete panel when the drawer is closed
    this.subscription.add(
      this.drawerState
        .drawnOpenChange()
        .pipe(filter((drawnOpen) => !drawnOpen))
        .subscribe(() => this.autocomplete.closePanel())
    );
  }

  private getChartData(): void {
    this.subscription.add(this.state.getChartData$().subscribe((network) => this.onNewChartData(network)));
  }

  private onNewChartData(bioNetwork: BnBioNetworkGraph): void {
    if (bioNetwork) {
      this.objects = ClHelpService.sortAlphabeticalOrder(
        bioNetwork.getMetabolitesAndReactionData(),
        (object) => object.name
      );
    } else {
      this.objects = [];
    }
    this.searchControl.patchValue('');
    this.cdr.markForCheck();
  }

  displayFn(metabolite: BnBioNetworkObject): string {
    return metabolite ? metabolite.name : '';
  }

  selectObject(): void {
    const object: string | BnBioNetworkObject = this.searchControl.value;
    if (object == null || typeof object === 'string') return;

    this.selectionState.selectMetaboliteAndReaction(object.id);
  }

  // method to filter metabolites based on string
  private filter(searchValue: string): BnBioNetworkObject[] {
    return this.objects.filter(
      (object) =>
        ClStringHelper.stringContains(object.name, searchValue, true, true, true) ||
        ClStringHelper.stringContains(object.id, searchValue, true, true, true)
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
