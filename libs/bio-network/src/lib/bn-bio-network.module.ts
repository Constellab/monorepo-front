import { inject, ModuleWithProviders, NgModule, Provider, Type } from '@angular/core';
import {
  BnBioNetworkSelectionInfoComponent,
} from './component/bn-bio-network-selection-info/bn-bio-network-selection-info.component';
import { BnBioNetworkLinkPipe } from './pipe/bn-bio-network-link.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  BnBioNetworkEngineProgressComponent,
} from './component/bn-bio-network-engine-progress/bn-bio-network-engine-progress.component';
import {
  BnBioNetworkNodeReactionDetailComponent,
} from './component/bn-bio-network-node-reaction-detail/bn-bio-network-node-reaction-detail.component';
import { CommonModule } from '@angular/common';
import {
  BnBioNetworkNodeDetailComponent,
} from './component/bn-bio-network-node-detail/bn-bio-network-node-detail.component';
import {
  BnBioNetworkCompartmentsComponent,
} from './component/bn-bio-network-compartments/bn-bio-network-compartments.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  BnBioNetworkNodeLinksComponent,
} from './component/bn-bio-network-node-links/bn-bio-network-node-links.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  BnBioNetworkNodeCofactorDetailComponent,
} from './component/bn-bio-network-node-cofactor-detail/bn-bio-network-node-cofactor-detail.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  BnBioNetworkLegendComponent,
} from './component/bn-bio-network-legend/bn-bio-network-legend.component';
import {
  BnBioNetworkMetaboliteDetailComponent,
} from './component/bn-bio-network-metabolite-detail/bn-bio-network-metabolite-detail.component';
import { MatSelectModule } from '@angular/material/select';
import {
  BnBioNetworkNodeSearchComponent,
} from './component/bn-bio-network-node-search/bn-bio-network-node-search.component';
import {
  BnBioNetworkNodeLayoutComponent,
} from './component/bn-bio-network-node-layout/bn-bio-network-node-layout.component';
import { MatIconModule } from '@angular/material/icon';
import {
  BnBioNetworkReactionDetailComponent,
} from './component/bn-bio-network-reaction-detail/bn-bio-network-reaction-detail.component';
import {
  BnBioNetworkReactionContentComponent,
} from './component/bn-bio-network-reaction-content/bn-bio-network-reaction-content.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BnBioNetworkComponent } from './component/bn-bio-network/bn-bio-network.component';
import {
  BnBioNetworkEngineConfigComponent,
} from './component/bn-bio-network-engine-config/bn-bio-network-engine-config.component';
import {
  BnBioNetworkDrawerComponent,
} from './component/bn-bio-network-drawer/bn-bio-network-drawer.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  BnBioNetworkNodeMetaboliteDetailComponent,
} from './component/bn-bio-network-node-metabolite-detail/bn-bio-network-node-metabolite-detail.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  BnBioNetworkConfigComponent,
} from './component/bn-bio-network-config/bn-bio-network-config.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import {
  BnBioNetworkReactionFluxComponent,
} from './component/bn-bio-network-reaction-flux/bn-bio-network-reaction-flux.component';
import { MatListModule } from '@angular/material/list';
import { BnBioNetworkService } from './service/bn-bio-network.service';
import { MatSliderModule } from '@angular/material/slider';
import { bnBioNetworkI18n } from './i18n/bn-bio-network.i18n';
import {
  BnBioNetworkClustersListComponent,
} from './component/bn-bio-network-clusters-list/bn-bio-network-clusters-list.component';
import {
  BnBioNetworkActionBarComponent,
} from './component/bn-bio-network-action-bar/bn-bio-network-action-bar.component';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlDrawerModule } from '@monorepo/front-core-lib/fl-drawer';
import { FlJsonEditorModule } from '@monorepo/front-core-lib/fl-json-editor';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlTranslateModule, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';


/**
 * Module to handle specific chart to show a pathway
 */
@NgModule({
  declarations: [
    BnBioNetworkNodeDetailComponent,
    BnBioNetworkNodeLinksComponent,
    BnBioNetworkDrawerComponent,
    BnBioNetworkConfigComponent,
    BnBioNetworkActionBarComponent,
    BnBioNetworkCompartmentsComponent,
    BnBioNetworkSelectionInfoComponent,
    BnBioNetworkNodeSearchComponent,
    BnBioNetworkReactionDetailComponent,
    BnBioNetworkMetaboliteDetailComponent,
    BnBioNetworkClustersListComponent,
    BnBioNetworkComponent,
    BnBioNetworkEngineConfigComponent,
    BnBioNetworkEngineProgressComponent,
    BnBioNetworkReactionFluxComponent,
    BnBioNetworkNodeMetaboliteDetailComponent,
    BnBioNetworkNodeReactionDetailComponent,
    BnBioNetworkNodeCofactorDetailComponent,
    BnBioNetworkLegendComponent,
    BnBioNetworkNodeLayoutComponent,
    BnBioNetworkLinkPipe,
    BnBioNetworkReactionContentComponent,
  ],
  exports: [BnBioNetworkComponent, BnBioNetworkNodeLayoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatListModule,
    MatSliderModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatProgressBarModule,
    ScrollingModule,

    FlTranslateModule,
    FlJsonEditorModule,
    FlCoreDirectiveModule,
    FlCoreComponentModule,
    FlDrawerModule,
    FlKeyValueModule,
    FlDateModule,
    FlTextIconModule,
    FlDialogModule,
    FlLoaderModule,
    FlCorePipeModule,
  ],
})
export class BnBioNetworkModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('BnBioNetworkModule', bnBioNetworkI18n);
  }

  public static forRoot(
    bioNetworkServiceClass?: Type<BnBioNetworkService>
  ): ModuleWithProviders<BnBioNetworkModule> {
    const providers: Provider[] = [];
    if (bioNetworkServiceClass) {
      providers.push({ provide: BnBioNetworkService, useClass: bioNetworkServiceClass });
    }

    return {
      ngModule: BnBioNetworkModule,
      providers: providers,
    };
  }
}
