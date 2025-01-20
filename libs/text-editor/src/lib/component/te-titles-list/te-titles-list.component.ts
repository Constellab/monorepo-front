import { Component, input } from '@angular/core';
import { TeBlockHeaderData, TeBlockHeaderLevel } from '../../model/lib';

@Component({
    selector: 'te-titles-list',
    templateUrl: './te-titles-list.component.html',
    styleUrl: './te-titles-list.component.scss',
    standalone: false
})
export class TeTitlesListComponent {
  titles = input.required<TeBlockHeaderData[]>();

  header1 = TeBlockHeaderLevel.HEADER_1;
}
