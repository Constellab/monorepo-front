import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {HaRouterService} from '../ha-service/ha-router.service';

@Injectable({
  providedIn: 'root'
})
export class HaSpecialDocGuard {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('state.url', state.url.split('/tech-doc'));
    if (state.url.startsWith('/tech-doc')) {
      const newRoute = [HaRouterService.getTechDocRoute().split('/')];
      this.router.navigate(newRoute).then(() => {
        return false;
      });
    }
    if (state.url.startsWith('/product-doc')) {
      const segments = state.url.split('/').slice(2);
      const newRoute = ['/', ...HaRouterService.getProductDocRoute().split('/'), ...segments];
      this.router.navigate(newRoute).then(() => {
        return false;
      });
    }
    return false;
  }
}
