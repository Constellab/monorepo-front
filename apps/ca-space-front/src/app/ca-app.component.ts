import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'ca-root',
  templateUrl: './ca-app.component.html',
  styleUrls: ['./ca-app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterOutlet],
})
export class CaAppComponent {}
