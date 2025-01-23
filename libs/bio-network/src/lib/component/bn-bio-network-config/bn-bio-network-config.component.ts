import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { BnBioNetworkState } from '../../state/bn-bio-network.state';
import { BnBioNetwork } from '../../model/bn-bio-network.class';
import { BnBioNetworkLegendComponent } from '../bn-bio-network-legend/bn-bio-network-legend.component';
import { MatSelectChange } from '@angular/material/select';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

/**
 * Component to select the network and the pathways database
 */
@Component({
  selector: 'bn-bio-network-config',
  templateUrl: './bn-bio-network-config.component.html',
  styleUrls: ['./bn-bio-network-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class BnBioNetworkConfigComponent implements OnInit {
  private state = inject(BnBioNetworkState);
  private dialogService = inject(FlDialogService);

  networks: BnBioNetwork[] | null;
  networkName: string;

  // database: FlPathwayDatabase;
  // pathwayDatabases: FlPathwayDatabase[] = flPathwayDatabases;

  ngOnInit(): void {
    // if there is multiple network we set the list to add a mat-select
    if (this.state.networks.length > 1) {
      this.networks = this.state.networks;
    }

    this.networkName = this.state.getSelectedNetwork().name;
    // this.database = this.state.getDatabase();
  }

  onNetworkChange(change: MatSelectChange): void {
    this.state.selectNetwork(change.value);
  }

  // onDatabaseChange(change: MatSelectChange): void {
  //   this.state.selectDatabase(change.value);
  // }

  openLegendDialog(): void {
    this.dialogService.openSmallDialog(BnBioNetworkLegendComponent);
  }
}
