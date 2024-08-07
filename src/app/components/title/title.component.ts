import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  constructor(
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.setTitleOnRouteChange();
  }

  private setTitleOnRouteChange(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        const title = data['title'] || 'Default Title';
        this.titleService.setTitle(title);
      });
  }
}
