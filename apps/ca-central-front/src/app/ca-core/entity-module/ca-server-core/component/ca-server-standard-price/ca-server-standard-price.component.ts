import { Component, inject, input } from '@angular/core';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { FlLoaderModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';

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
