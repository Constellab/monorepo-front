import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ClHelpService } from '@monorepo/core-lib';
import { Observable, Subscription } from 'rxjs';

import { CaSpace } from '../../../../model/entities/space/ca-space.class';
import { CaSpaceService } from '../../../../service-api/ca-space.service';

export type CaSpacePhotoSize = 'small' | 'medium' | 'big';

/**
 * Component to show the photo of an space or the initial of the space name
 */
@Component({
  selector: 'ca-space-photo',
  templateUrl: './ca-space-photo.component.html',
  styleUrls: ['./ca-space-photo.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NgClass],
})
export class CaSpacePhotoComponent implements OnInit, OnDestroy {
  private spaceService = inject(CaSpaceService);

  @Input() space: CaSpace | Observable<CaSpace>;

  @Input() size: CaSpacePhotoSize | string = 'medium';

  label: string;

  sizeNumber: number = 3;
  fontSize: number;

  photo: string | null;
  initial: string;

  private subscription: Subscription;

  ngOnInit(): void {
    if (this.space instanceof Observable) {
      this.subscription = this.space.subscribe((space) => this.initSpace(space));
    } else {
      this.initSpace(this.space);
    }
  }

  private initSpace(space: CaSpace): void {
    if (!ClHelpService.isNullOrEmpty(space.photo)) {
      this.photo = this.spaceService.getSpacePhoto(space.photo);
    } else {
      this.photo = null;
    }
    this.initial = space.name.charAt(0).toUpperCase();
    this.label = space.name;

    switch (this.size) {
      case 'small':
        this.sizeNumber = 2.5;
        break;
      case 'medium':
        this.sizeNumber = 3;
        break;
      case 'big':
        this.sizeNumber = 6;
        break;
      default:
        this.sizeNumber = +this.size;
    }
    this.fontSize = this.sizeNumber / 4;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
