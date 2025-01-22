import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'lab-root',
  templateUrl: './lab-app.component.html',
  styleUrls: ['./lab-app.component.scss'],
  imports: [RouterOutlet],
})
export class LabAppComponent {}
