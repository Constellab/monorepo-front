import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { switchMap } from 'rxjs';

import { CaServerService } from '../../../../service-api/ca-server.service';

@Component({
  selector: 'ca-server-standard-price',
  templateUrl: './ca-server-standard-price.component.html',
  styleUrl: './ca-server-standard-price.component.scss',
  imports: [FlLoaderModule],
})
export class CaServerStandardPriceComponent {
  serverStandardId = input.required<string>();

  private serverService = inject(CaServerService);

  price = toSignal(
    toObservable(this.serverStandardId).pipe(
      switchMap((serverStandardId) => this.serverService.getServerPrice(serverStandardId))
    ),
    { initialValue: null }
  );
}
