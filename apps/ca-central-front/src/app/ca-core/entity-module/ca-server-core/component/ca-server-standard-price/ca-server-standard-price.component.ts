import { Component, inject, input } from '@angular/core';
import { CaServerService } from '../../../../service-api/ca-server.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Component({
    selector: 'ca-server-standard-price',
    templateUrl: './ca-server-standard-price.component.html',
    styleUrl: './ca-server-standard-price.component.scss',
    standalone: false
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
