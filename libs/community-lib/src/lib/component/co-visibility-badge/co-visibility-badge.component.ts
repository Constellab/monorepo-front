import {Component, Input, OnInit} from '@angular/core';
import {CoSpace} from '../../model/co-space.class';
import {CoServiceConfig} from '../../service/co-service-config.config';


@Component({
  selector: 'co-visibility-badge',
  templateUrl: './co-visibility-badge.component.html',
  styleUrls: ['./co-visibility-badge.component.scss']
})
export class CoVisibilityBadgeComponent implements OnInit{

  @Input() space: CoSpace = null;

  constructor(private coServiceConfig: CoServiceConfig) {
  }

  ngOnInit(): void {
    if(this.space && this.space.photo){
      this.space.photo = this.coServiceConfig.getSpacePhotoUrl(this.space.photo);
      console.log('photo: ', this.space.photo)
    }
  }

}
