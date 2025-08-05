import { Component, inject, input, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

import { HaEntityType } from '../../../../ha-model/ha-entities/ha-entity-type';
import { HaIsAuthenticatedDirective } from '../../../../ha-module/ha-core-directive/ha-is-authenticated/ha-is-authenticated.directive';
import { HaAuthService } from '../../../../ha-service/ha-auth.service';
import { HaLikeService } from '../../../../ha-service/ha-like.service';
import { HaRouterService } from '../../../../ha-service/ha-router.service';

@Component({
  selector: 'ha-like-button',
  templateUrl: './ha-like-button.component.html',
  styleUrls: ['./ha-like-button.component.scss'],
  imports: [MatButton, HaIsAuthenticatedDirective, MatIcon],
})
export class HaLikeButtonComponent implements OnInit {
  private likeService: HaLikeService = inject(HaLikeService);
  private authService: HaAuthService = inject(HaAuthService);
  private router: Router = inject(Router);

  entityType = input.required<HaEntityType>();
  entityId = input.required<string>();

  profileRoute: string = HaRouterService.getProfileRoute();
  isLike: boolean = false;
  likeCount: number = 0;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.isLoading = true;
    this.likeService.checkIfLiked(this.entityType(), this.entityId()).subscribe((isLiked) => {
      this.isLike = isLiked;
      this.isLoading = false;
    });

    this.likeService.getLikeCount(this.entityType(), this.entityId()).subscribe((likeCount) => {
      this.likeCount = likeCount;
    });
  }

  click(): void {
    if (!this.authService.hasAuthorizationCookie()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.isLoading) {
      this.isLoading = true;
      if (this.isLike) {
        this.likeService.unlike(this.entityType(), this.entityId()).subscribe((likeCount) => {
          this.isLike = false;
          this.likeCount = likeCount;
          this.isLoading = false;
        });
      } else {
        this.likeService.like(this.entityType(), this.entityId()).subscribe((likeCount) => {
          this.isLike = true;
          this.likeCount = likeCount;
          this.isLoading = false;
        });
      }
    }
  }
}
