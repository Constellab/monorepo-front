import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HaUser} from '../../../ha-core/ha-model/ha-entities/ha-user';
import {HaSpaceService} from '../../../ha-core/ha-service/ha-space.service';
import {Observable} from 'rxjs';
import {HaSpace} from '../../../ha-core/ha-model/ha-entities/ha-space.class';

@Component({
  selector: 'ha-selectable-space-list',
  templateUrl: './ha-selectable-space-list.component.html',
  styleUrls: ['./ha-selectable-space-list.component.scss']
})
export class HaSelectableSpaceListComponent implements OnInit{

  @Input() user: HaUser;

  @Output() spaceSelectedEvent = new EventEmitter<string>();

  spaceList$: Observable<HaSpace[]>;

  selectedSpaces: string[] = [];

  constructor(private spaceService: HaSpaceService) {
  }

  ngOnInit(): void{
    this.spaceList$ = this.spaceService.getSpacesOfCurrentUser();
  }

  isSelected(spaceId: string): boolean {
    return this.selectedSpaces.find((s) => s == spaceId) != null;
  }

  selectSpace(spaceId: string): void {
    if (this.isSelected(spaceId)) {
      this.selectedSpaces = this.selectedSpaces.filter((s) => s != spaceId);
    }
    else {
      this.selectedSpaces.push(spaceId);
    }
    this.spaceSelectedEvent.emit(spaceId);
  }

}
